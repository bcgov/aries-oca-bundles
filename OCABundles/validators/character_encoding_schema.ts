const character_encoding_schema = {
  type: "object",
  properties: {
    type: { type: "string" },
    capture_base: { type: "string" },
    default_character_encoding: { type: "string" },
    attr_character_string: { type: "object" }
  },
  required: ["type", "capture_base"],
  additionalProperties: { type: "string" }
}

export default character_encoding_schema;