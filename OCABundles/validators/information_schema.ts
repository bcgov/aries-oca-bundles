const information_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    language: { type: "string" },
    attribute_information: { type: "object" },
  },
  required: ["type", "capture_base", "language", "attribute_information"],
  additionalProperties: { type: "string" }
};

export default information_schema;