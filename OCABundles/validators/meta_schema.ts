const meta_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    language: { type: "string" },
    attribute_labels: { type: "string" },
    name: { type: "string" },
    description: { type: "string" }
  },
  required: ["type", "capture_base", "language"],
  additionalProperties: { type: "string" }
};

export default meta_schema;