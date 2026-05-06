import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "What is DreamVault?",
    answer: "DreamVault is a decentralized platform that uses advanced AI to translate text descriptions of dreams into detailed, interactive digital universes, which are then minted as permanent NFTs on the Solana blockchain."
  },
  {
    question: "How does the AI generate my dream universe?",
    answer: "Our proprietary neural engine, guided by the NOX assistant, parses your description for thematic, structural, and emotional elements. It then constructs a multi-layered universe containing visual data, lore fragments, and metaphysical properties."
  },
  {
    question: "What blockchain does DreamVault use?",
    answer: "We are built exclusively on Solana to leverage its high speed, low costs, and minimal environmental impact, ensuring your dream universe is minted instantly."
  },
  {
    question: "How much does it cost to mint a dream NFT?",
    answer: "Minting typically costs around 0.002 SOL (network fee) plus a small platform fee. The exact cost fluctuates slightly based on network congestion."
  },
  {
    question: "Can I sell my dream NFTs?",
    answer: "Yes. Once minted, your dream universe is a standard Solana NFT that can be traded on any compatible marketplace like Magic Eden or Tensor."
  },
  {
    question: "What is NOX?",
    answer: "NOX is our specialized AI agent manifested as a digital wolf spirit. NOX guides you through the generation process, helps refine your inputs, and adds narrative depth to your created universes."
  },
  {
    question: "Are my dreams private?",
    answer: "By default, generated dreams are public and displayed in the Community Gallery. We will be introducing a 'Dark Mode' feature for private, encrypted dream storage in a future update."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative z-10 bg-black/40">
      <div className="container max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 gradient-text">SYSTEM INQUIRIES</h2>
        </div>

        <Accordion type="single" collapsible className="w-full glass rounded-2xl border border-white/5 p-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-left font-orbitron text-foreground/90 hover:text-primary hover:no-underline transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
