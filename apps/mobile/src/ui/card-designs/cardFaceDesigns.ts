export type CardFaceDesignId = "modern" | "traditional";

export type CardFaceDesign = {
  id: CardFaceDesignId;
  label: string;
};

export const cardFaceDesigns: CardFaceDesign[] = [
  {
    id: "modern",
    label: "Moderno"
  },
  {
    id: "traditional",
    label: "Tradicional"
  }
];

