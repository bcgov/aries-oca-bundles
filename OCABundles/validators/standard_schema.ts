const standard_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    language: { type: "string" },
    attr_standards: { type: "string" }
  },
  required: ["type", "capture_base", "attr_standards"],
  additionalProperties: { type: "string" }
};

export default standard_schema;