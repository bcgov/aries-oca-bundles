const label_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    language: { type: "string" },
    attribute_labels: { type: "object" },
    attribute_categories: { type: "array" },
    category_labels: { type: "object" }
  },
  required: ["type", "capture_base", "language", "attribute_labels"],
  additionalProperties: { type: "string" }
};

export default label_schema;