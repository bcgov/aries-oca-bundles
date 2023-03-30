# OCA Bundle Creation

Creating an OCA Bundle consists of two steps.

* Creating the OCA Source data, usually in Excel and JSON.
* Generating an OCA Bundle from the OCA Source Data using a script in this repository.
    * The prerequisites for the script are a tad painful. We're hoping to reduce
      the complexity of the script.

We'll cover the two steps in the following two sections.

## Creating the OCA Source Data

This section assumes you are somewhat familiar with the [OCA Specification]
including the format of JSON OCA Bundles, and the various overlay types that
have been defined. As well, we assume you are familiar with [Aries for OCA RFC
0755], and what OCA overlays are used for providing semantic, multi-language and
branding information about AnonCreds credential types. If you haven't gone
through that information, please start there. It is important to understand how
to populate the "Main" tab of the Excel file needed as OCA Source data. That's
not covered here. Here is a [link to a presentation] and [recording of a session]
that was presented at an Aries Working Group meeting on OCA for Aries.

In the [OCA for Aries RFC 0755] are the instructions for creating the OCA Source
data. The following summarizes the steps of creating an OCA Source Excel file,
and a `branding.json` file for the Aries-specific "Branding" Overlay.

### OCA Excel File

An Aries OCA Bundle can be managed as pure JSON as found in this [sample OCA for
Aries OCA Bundle]. However, managing such content in JSON is not
easy, particularly if the multi-language translations come from team members not
comfortable with working in JSON. An easier way to manage the data is to use an
OCA source spreadsheet for most of the data, some in a source JSON file, and to
use a converter to create the OCA Bundle JSON from the two sources.

The OCA Source Spreadsheet, an [example of which is attached to this
RFC](OCA4Aries.xlsx), contains the following:

- An introductory tab about the OCA content in the spreadsheet.
- A tab with instructions on using the spreadsheet.
- A "Main" tab with the "Capture Base" data, along with data for other, non-multilingual overlays.
- A language or country-language code tab per country-language to be supported by the issuer
  containing the source data for all multilingual overlays.

The following is how to create an OCA Source spreadsheet.

- Make a copy of the latest [OCA Template] from the [Human Colossus Foundation].
- Fill in the "Main" tab with the attributes from the schema, completing the
relevant columns for each attribute. Current columns to complete:
- CB-CL: Classification
- CB-AN: Attribute Name
- CB-AT: Attribute Type
- CB-FA: Flagged Attribute
- OL-CH: Character Encoding
- OL-FT: Format
- OL-ST: Standard
- OL-EC: Entry Codes
- OL-UT: Unit
- As needed, populate the columns for "dateint" and "Unix Time" attributes as indicated in the [Aries Specific Dates in the OCA Formats Overlay] section of this document.
- Rename the sample language tab (`en`) to one of the language or language-country that as an issuer, you want to support.
- Fill in the data in columns after C (which is automatically populated from
the `Main` tab) for the first language as appropriate. In most cases only
the "Label" and "Information" columns need be populated.
- Populate column A and B as follows:
- In column A (`OL-MN: Meta [Attribute Name]`), add the values:
    - "name"
    - "description"
    - "issuer"
    - "issuer_description"
    - "issuer_url"
    - "credential_help"
    - "credential_support_url"
- Complete column B (`OL-MV: Meta [Attribute Value]`) as appropriate for each column A name.
- Duplicate and rename the initial language tab for each language or language-country that as an issuer, you want to support.
- Update each additional language tab.

Once you have the Excel file, save it to the OCA Bundle folder for your Credential. The folder will be in the path:

- OCABundles
  - The DID used to create the Schema or Credential Definition for your credential
    - The SchemaID or CredentialDefinitionID of your schema or credential

### Branding JSON File

In addition to the OCA Source Excel file, you should create a Branding Overlay
JSON source file. The format of the file is the following:

To create the file for your OCA Bundle:

- Create a file called `branding.json` in the same folder as your OCA Source Excel file
- Populate the data values in the overlay as appropriate for your Credential.
- Do not change the values of the `type`, `capture_base` and `digest` items.

```json
[
    {
        "logo": "",
        "background_image_slice": "",
        "background_image": "",
        "primary_background_color": "#32674e",
        "secondary_background_color": "#32674e",
        "capture_base": "E75sopl65qnoZRwjQQ0FjWGemLlOXcXtanhScZ2CloJY",
        "digest": "EBQbQEV6qSEGDzGLj1CqT4e6yzESjPimF-Swmyltw5jU",
        "expiry_date_attribute": "",
        "primary_attribute": "",
        "secondary_attribute": "",
        "type": "aries/overlays/branding/1.0"
    }
]
```

The image values may be URLs for the images. A common practice is to put the images
in the same folder as the OCA Source Excel and branding.json files, and to use the
GitHub "raw" URL to reference the data, such as:

`https://raw.githubusercontent.com/swcurran/aries-oca-bundles/main/OCABundles/XUxBrVSALWHLeycAUhrNr9/XUxBrVSALWHLeycAUhrNr9:2:student_card:1.0/best-bc-logo.png`

If the images are small such that the don't break the tooling, you can inline the images using the format `data:image/png;base64,<base64 data>`. However
be warned that the OCA Source to OCA Bundle tooling provided here will break if the images are too large.

Once you have the Excel and JSON source files, you are ready to go!

## Generating an OCA Bundle from Source

A bash script `genBundle.sh` can be found in the `scripts` folder of the repo. To install it, you
need to install a few prerequisites--`jq` and the OCA Excel Parser.

### Prerequisites

Developers will likely have the `jq` (JSON Query) command line utility already installed. If not, follow the
[JQ installation instructions]. Once installed, make sure `jq` is on your path.

Installing the OCA Excel Parser is a little more involved, as you need Rust installed on your machine. Here are the steps:

- Clone a local copy of the OCA Excel Parser repository.
- If you don't have Rust installed on your machine, following the [Rust Installation Instructions].

> More details to be added...

JSON Source file contains the [Aries-specific Branding
Overlay](#aries-specific-branding-overlay). Attached to this RFC is an [example
Branding Overlay JSON file](branding.json) that issuers can use to start.
