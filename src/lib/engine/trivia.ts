/** Fun facts shown while Cosmo "thinks up" a new question, so waiting feels like learning. */
export const MATH_TRIVIA: string[] = [
  "The equals sign (=) was invented in 1557 by Robert Recorde, who was tired of writing 'is equal to' over and over.",
  'Ada Lovelace wrote notes in the 1840s describing how a machine could follow step-by-step instructions, making her the first computer programmer ever.',
  'Carl Friedrich Gauss supposedly added up 1 to 100 in seconds as a kid by pairing numbers: (1+100) + (2+99) + ... = 101 x 50.',
  "Honeybees build honeycombs out of hexagons because that shape stores the most honey using the least wax — nature loves efficient math!",
  'The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...) shows up in sunflower seeds, pinecones, and even the spiral arms of galaxies.',
  "Al-Khwarizmi, a 9th-century Persian scholar, wrote a book whose title gave us the word 'algebra'.",
  'Zero was not always a number. Ancient Rome had no symbol for it at all, and it took centuries for zero to be accepted as a real number.',
  "Hypatia of Alexandria, who lived around 350-415 AD, was one of the first women known to make major contributions to mathematics and astronomy.",
  'GPS satellites have to correct their clocks using Einstein\'s equations of relativity — without that math, your map app could be off by miles!',
  'Srinivasa Ramanujan taught himself advanced math from library books in India and discovered thousands of new formulas with almost no formal training.',
  "Katherine Johnson's hand calculations helped NASA plot the flight paths that sent astronauts to orbit and back safely.",
  'Pierre de Fermat once scribbled a math claim in the margin of a book — it took mathematicians 358 years to finally prove it.',
  'Music and math are close friends: jumping up one octave means doubling the sound wave frequency, a simple 2:1 ratio.',
  "Online shopping is kept safe by cryptography that relies on how hard it is to factor extremely large numbers — a problem straight out of algebra class.",
  'Johannes Kepler discovered that planets travel around the Sun in ellipses, not perfect circles, using nothing but careful math and observation.',
  'To escape Earth\'s gravity, a rocket needs to reach about 11.2 kilometers per second — that speed comes straight from algebra and physics equations.',
  'Emmy Noether proved a theorem connecting symmetry to the conservation of energy, becoming one of the most influential mathematicians in physics.',
  "Negative numbers were once considered 'absurd' by many mathematicians — it took hundreds of years for them to be fully accepted.",
  "Pythagoras and his followers were so fascinated by numbers that they formed a secret society built around mathematical ideas.",
  "Euclid's book 'Elements,' written over 2,000 years ago, is still one of the most influential math textbooks in history.",
  'Architects and engineers use quadratic equations to design arches and bridges that can safely hold their shape under weight.',
  'Weather forecasters use systems of equations and huge amounts of data to predict whether it will rain tomorrow.',
  'The word "algorithm" — a set of step-by-step instructions — comes from the name of the mathematician Al-Khwarizmi.',
  'Video game graphics rely on functions and coordinate geometry to figure out exactly where every pixel and character should appear on screen.',
];

/** Fun facts shown while Cosmo "thinks up" a new biology question. */
export const BIOLOGY_TRIVIA: string[] = [
  'A single teaspoon of soil can contain more living microorganisms than there are people on Earth.',
  "Octopuses have three hearts and blue blood — their blood uses copper instead of iron to carry oxygen.",
  'Your body replaces most of its cells on a regular basis — red blood cells live about four months before being recycled.',
  "Tardigrades ('water bears') can survive being frozen, dried out completely, and even exposed to the vacuum of space.",
  "Bananas share about 60% of their DNA with humans, a reminder that all life shares a common evolutionary history.",
  'The human body contains around 37 trillion cells, each one carrying nearly the same set of DNA instructions.',
  "If you stretched out all the DNA in one of your cells, it would be about 2 meters long — yet it fits inside a nucleus too small to see.",
  'Some jellyfish, like Turritopsis dohrnii, can reverse their aging process and essentially become young again.',
  "Photosynthesis in plants and algae produces most of the oxygen we breathe — even some ocean plankton play a huge role.",
  'Mitochondria, the "powerhouses" of cells, were once free-living bacteria that were absorbed by ancient cells billions of years ago.',
  'A group of crows is called a "murder," but crows are also famously intelligent and can recognize individual human faces.',
  "The axolotl, a type of salamander, can regrow entire limbs, parts of its heart, and even sections of its brain.",
  "Humans share about 98-99% of their DNA with chimpanzees, our closest living relatives.",
  'Sharks have been around for over 400 million years — longer than trees have existed on Earth.',
  "A bolt of lightning can trigger chemical reactions in the atmosphere that mimic the early steps scientists think led to life's building blocks.",
  'Some bacteria can go dormant for thousands of years and then "wake up" and start growing again when conditions improve.',
  "Your stomach lining replaces itself every few days — otherwise the acid that digests your food would start digesting your stomach.",
  'Mushrooms are more closely related to animals than to plants on the tree of life.',
  "The Venus flytrap counts: it only snaps shut after its trigger hairs are touched twice within about 20 seconds, to avoid wasting energy on false alarms.",
  "Elephants are one of the few animals that can recognize themselves in a mirror, a sign of self-awareness.",
  'A single strand of spider silk is stronger than a steel wire of the same thickness.',
  "Cells called neurons can be over a meter long in large animals — a single neuron can stretch from your spine to your toes.",
  "Some species of frogs can survive being frozen solid in winter, then thaw out and hop away in spring.",
  'The platypus is one of the only mammals that lays eggs instead of giving birth to live young.',
];

/** Pick a random trivia fact from a list, optionally avoiding the most recently shown one. */
export function randomTrivia(list: string[], exclude?: string): string {
  if (list.length <= 1) return list[0];
  let pick: string;
  do {
    pick = list[Math.floor(Math.random() * list.length)];
  } while (pick === exclude);
  return pick;
}
