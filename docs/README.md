# Aries OCA Bundles

This website (published from the [Aries OCA Bundles] GitHub repository) is
human- and machine-readable registry of published Overlays Capture Architecture
(OCA) Bundles to be used by Hyperledger Aries agents (issuers, holders and
verifiers). The publishing process includes a lightweight [governance] process
for ensuring those contributing to the repository are the "authority" over the
OCA Bundles they submit/update, and that what they submit is, in fact, a valid
OCA Bundle for a published [Hyperledger AnonCreds] Schema and/or Credential
Definition. Once published, Aries agents following the [OCA for Aries RFC]
guidance have an easy to implement [process](#using-these-oca-bundles-in-an-aries-agent)
for finding, retrieving and using OCA Bundles for credentials that they need to display.

[Aries OCA Bundles]: https://github.com/bcgov/aries-oca-bundles
[governance]: governance/GOVERNANCE.md
[Hyperledger AnonCreds]: https://www.hyperledger.org/projects/anoncreds

The OCA Bundles should follow the rules for [OCA for Aries RFC] OCA Bundles,
including the [OCA for Aries Style Guide RFC]. Each OCA Bundle must be accompanied
by some metadata about the credential, such as on what ledger the credential
schema and/or credential definition (CredDef) reside, and may be accompanied by the full OCA
Source data--Excel and JSON files.  There are tools in the associated GitHub repository for
converting OCA Source to the Bundle to make it easier for contributors.

[OCA for Aries RFC]: https://github.com/hyperledger/aries-rfcs/blob/main/features/0755-oca-for-aries/README.md
[OCA for Aries Style Guide RFC]: https://github.com/hyperledger/aries-rfcs/blob/main/features/0756-oca-for-aries-style-guide/README.md

Currently, the repository assumes that the OCA Bundles are for
[Hyperledger AnonCreds] Verifiable Credentials. We
expect that other formats, such as W3C Verifiable Credentials Data Model
Standard JSON-LD credentials will eventually also be supported.

To see all of the OCA for Aries Bundles that have been published in this
repository, use either the [OCA Bundles] tab, or the [OCA Explorer] tab. The
[OCA Bundles] tab contains a page about each bundle in the repository, while the
[OCA Explorer] tab provides a tool for experimenting with the branding of an OCA
Bundle. Use the drop down to see/experiment with all the OCA Bundles in the
registry, or upload your own OCA Bundle in the [OCA Explorer] to see how it will
look.

[OCA Explorer]: oca-explorer
[OCA Bundles]: OCABundles/schema/bcgov-digital-trust/business-card/

## Contributing an OCA Bundle

For information about contributing an OCA Bundle into the registry, please
see the information in the [Contributing] section of this website.

[Contributing]: contributing/CONTRIBUTING.md

## Using these OCA Bundles in an Aries Agent

For information about using the OCA Bundles in this registry in an Aries Agent, please
see the information in the [Using OCA Bundles] section of this website.

[Using OCA Bundles]: using/usingOCABundles.md
