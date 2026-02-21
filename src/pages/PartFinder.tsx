import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, ChevronRight, Cpu, Bot, Send, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModelSearch, useCompatibleProducts } from "@/hooks/usePartFinder";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Msg = {role: "user" | "assistant";content: string;};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/part-finder-ai`;

// Parse product cards from AI response
function parseAIContent(content: string) {
  const parts: Array<{type: "text";value: string;} | {type: "product";data: any;}> = [];
  const regex = /:::product({.*?}):::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    try {
      parts.push({ type: "product", data: JSON.parse(match[1]) });
    } catch {
      parts.push({ type: "text", value: match[0] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }
  return parts;
}

function ProductInlineCard({ data, navigate }: {data: any;navigate: (path: string) => void;}) {
  const whatsappMsg = siteConfig.whatsapp.defaultMessage(data.name, data.code ?? undefined);
  return (
    <div className="my-3 bg-card rounded-xl border border-border/40 p-4 flex gap-4 items-start hover:border-accent/30 transition-colors">
      {data.image &&
      <img src={data.image} alt={data.name} className="w-16 h-16 object-contain rounded-lg bg-background flex-shrink-0" />
      }
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {data.brand && <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{data.brand}</span>}
        </div>
        <h4 className="text-[13px] font-bold text-foreground line-clamp-1">{data.name}</h4>
        {data.code && <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{data.code}</p>}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => navigate(`/urun/${data.slug}`)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-border/80 text-foreground hover:bg-foreground hover:text-primary-foreground transition-all">

            Detay
          </button>
          <a
            href={siteConfig.social.whatsappUrl(whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-whatsapp text-primary-foreground hover:bg-whatsapp-hover transition-all">

            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>);

}

const PartFinder = () => {
  usePageMeta({ title: "TV Parça Bulucu | Garanti Elektronik", description: "TV model numaranızı girin veya Garanti Asistan'a arızanızı anlatın, uyumlu yedek parçaları anında bulun." });
  const [query, setQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<{id: string;model_number: string;brand_name?: string;} | null>(null);
  const { models, loading: searchLoading } = useModelSearch(selectedModel ? "" : query);
  const { products, loading: productsLoading } = useCompatibleProducts(selectedModel?.id ?? null);
  const navigate = useNavigate();

  // AI chat state
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isStreaming) return;
    setChatInput("");

    const userMsg: Msg = { role: "user", content: text };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ message: text, history })
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Bir hata oluştu." }));
        setMessages((prev) => [...prev, { role: "assistant", content: err.error ?? "Bir hata oluştu." }]);
        setIsStreaming(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Bağlantı hatası oluştu, tekrar deneyin." }]);
    }
    setIsStreaming(false);
  };

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => {
    const cat = p.category_name ?? "Diğer";
    (acc[cat] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/60 to-background py-16 lg:py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-6">
            <Cpu className="w-3.5 h-3.5" />
            Parça Bulucu
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            TV Yedek Parça Bulucu
          </h1>
          <p className="text-muted-foreground text-[15px] lg:text-[17px] mb-10 max-w-xl mx-auto">
            Model numarası ile arayın veya Garanti Asistan'a arızanızı anlatın — uyumlu parçaları anında bulun.
          </p>

          <Tabs defaultValue="ai" className="max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ai" className="gap-2">
                <Bot className="w-4 h-4" />
                Garanti Asistan
              </TabsTrigger>
              <TabsTrigger value="model" className="gap-2">
                <Search className="w-4 h-4" />
                Model Ara
              </TabsTrigger>
            </TabsList>

            {/* AI Chat Tab */}
            <TabsContent value="ai" className="text-left">
              <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
                {/* Chat messages */}
                <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 &&
                  <div className="text-center py-12">
                      <Bot className="w-12 h-12 text-accent/40 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2 font-medium">Garanti Asistan</p>
                      <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
                        Model kodu, semptom veya board code yazın. Örn: "UE55NU7100 flash_then_black" veya "BN44-00932B REV uyumu"
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {["Samsung UE55NU7100 flash_then_black", "LG 49UK6300 STBY5V yok", "Vestel T-Con 12V beslemesi gelmiyor"].map((q) =>
                      <button
                        key={q}
                        onClick={() => {
                          setChatInput(q);
                        }}
                        className="text-[11px] px-3 py-1.5 bg-muted/60 hover:bg-muted text-muted-foreground rounded-lg transition-colors">

                            {q}
                          </button>
                      )}
                      </div>
                    </div>
                  }

                  {messages.map((msg, i) =>
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === "user" ?
                      "bg-foreground text-background rounded-br-md" :
                      "bg-muted/60 text-foreground rounded-bl-md"}`
                      }>

                        {msg.role === "assistant" ?
                      parseAIContent(msg.content).map((part, j) =>
                      part.type === "text" ?
                      <span key={j} className="whitespace-pre-wrap">{part.value}</span> :

                      <ProductInlineCard key={j} data={part.data} navigate={navigate} />

                      ) :

                      <span>{msg.content}</span>
                      }
                      </div>
                    </div>
                  )}

                  {isStreaming && messages[messages.length - 1]?.role !== "assistant" &&
                  <div className="flex justify-start">
                      <div className="bg-muted/60 rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  }
                  
                </div>

                {/* Input */}
                <div className="border-t border-border/40 p-4 flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    value={chatInput}
                    onChange={(e) => {
                      setChatInput(e.target.value);
                      const el = e.target;
                      el.style.height = "auto";
                      el.style.height = Math.min(el.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                        if (textareaRef.current) textareaRef.current.style.height = "auto";
                      }
                    }}
                    placeholder="Model kodu, semptom veya arızayı yazın..."
                    className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isStreaming}
                    rows={1} />

                  <button
                    onClick={sendMessage}
                    disabled={isStreaming || !chatInput.trim()}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-40">

                    {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Model Search Tab */}
            <TabsContent value="model">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={selectedModel ? selectedModel.model_number : query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedModel(null);
                  }}
                  placeholder="Örn: UE55NU7100, 49UK6300, A55L..."
                  className="pl-12 h-14 text-base rounded-2xl border-border/60 bg-card shadow-sm focus-visible:ring-accent" />

                {searchLoading &&
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                }

                {models.length > 0 && !selectedModel &&
                <div className="absolute z-20 top-full mt-2 w-full bg-card border border-border/60 rounded-xl shadow-lg overflow-hidden">
                    {models.map((m) =>
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel({ id: m.id, model_number: m.model_number, brand_name: m.brand_name });
                      setQuery("");
                    }}
                    className="w-full text-left px-5 py-3.5 hover:bg-muted/60 transition-colors flex items-center justify-between group">

                        <div>
                          <span className="text-sm font-semibold text-foreground">{m.model_number}</span>
                          {m.brand_name && <span className="ml-2 text-xs text-muted-foreground">{m.brand_name}</span>}
                          {m.screen_size && <span className="ml-2 text-[10px] text-muted-foreground/60">• {m.screen_size}</span>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                      </button>
                  )}
                  </div>
                }
              </div>

              {selectedModel &&
              <button
                onClick={() => setSelectedModel(null)}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors">

                  Farklı model ara
                </button>
              }
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Model search results */}
      {selectedModel &&
      <section className="container mx-auto px-6 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-bold text-foreground">
              {selectedModel.brand_name && <span className="text-accent">{selectedModel.brand_name} </span>}
              {selectedModel.model_number}
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {products.length} uyumlu parça
            </span>
          </div>

          {productsLoading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) =>
          <div key={i} className="bg-card rounded-2xl border border-border/40 h-80 animate-pulse" />
          )}
            </div> :
        products.length === 0 ?
        <div className="text-center py-16 bg-card rounded-2xl border border-border/40">
              <p className="text-muted-foreground mb-4">Bu model için kayıtlı parça bulunamadı.</p>
              <a
            href={siteConfig.social.whatsappUrl(
              `Merhaba, ${selectedModel.model_number} modeli için yedek parça arıyorum.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:bg-whatsapp-hover transition-colors">

                <MessageCircle className="w-4 h-4" />
                WhatsApp'tan Sorun
              </a>
            </div> :

        Object.entries(grouped).map(([category, items]) =>
        <div key={category} className="mb-10">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((product) => {
              const whatsappMsg = siteConfig.whatsapp.defaultMessage(product.name, product.code ?? undefined);
              return (
                <article
                  key={product.id}
                  className="bg-card rounded-2xl overflow-hidden group card-hover-lift border border-border/40 hover:border-accent/20 transition-all duration-500">

                        <div className="aspect-[4/3] bg-background flex items-center justify-center p-8 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/30" />
                          {product.images?.[0] &&
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 relative z-10"
                      loading="lazy" />

                    }
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {product.brand_name &&
                      <span className="text-[10px] font-bold text-accent uppercase tracking-[0.15em]">
                                {product.brand_name}
                              </span>
                      }
                          </div>
                          <h4 className="text-[14px] font-bold text-foreground line-clamp-2 mb-2 leading-snug">
                            {product.name}
                          </h4>
                          {product.code &&
                    <p className="text-[11px] text-muted-foreground/70 font-mono bg-muted/60 inline-block px-2.5 py-1 rounded-md mb-4">
                              {product.code}
                            </p>
                    }
                          {product.notes &&
                    <p className="text-[11px] text-accent mb-3">📝 {product.notes}</p>
                    }
                          <div className="flex gap-2 mt-auto pt-2">
                            <button
                        onClick={() => navigate(`/urun/${product.slug}`)}
                        className="flex-1 text-[13px] font-semibold text-center py-2.5 text-foreground hover:bg-foreground hover:text-primary-foreground rounded-lg transition-all duration-300 border border-border/80">

                              Detay
                            </button>
                            <a
                        href={siteConfig.social.whatsappUrl(whatsappMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 flex-1 text-[12px] font-bold text-primary-foreground bg-whatsapp hover:bg-whatsapp-hover py-2.5 rounded-lg transition-all duration-300">

                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </article>);

            })}
                </div>
              </div>
        )
        }
        </section>
      }
    </div>);

};

export default PartFinder;