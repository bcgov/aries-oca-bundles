const format_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    attribute_formats: { type: "object" },
  },
  required: ["type", "capture_base", "attribute_formats"],
  additionalProperties: { type: "string" }
};

export default format_schema;