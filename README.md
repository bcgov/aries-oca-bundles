# Aries OCA Bundles

[![Lifecycle](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

This GitHub repository is for hosting published Overlays Capture Architecture
(OCA) Bundles to be used by Hyperledger Aries agents (issuers, holders and
verifiers). The repository includes a lightweight [governance] process for ensuring those
contributing to the repository are the "authority" over the OCA Bundle they are
submitting/updating, and that what they are submitting is, in fact, an OCA
Bundle for a published [Hyperledger AnonCreds] Schema and/or Credential Definition. While
this site is in the BCGov GitHub organization, anyone that follows the
governance process is welcome to publish their OCA Bundles here.

[Hyperledger AnonCreds]: https://www.hyperledger.org/projects/anoncreds
[governance]: docs/governance/GOVERNANCE.md

The content of this repository is published on GitHub pages at [https://bcgov.github.io/aries-oca-bundles/]. That's the place to go if you want to know:

- what Aries OCA Bundles are,
- how to use the OCA Bundles published from here,
- how to publish your own OCA Bundles, and
- how the OCA Bundle repository governance works,

Once you are ready to contribute your own OCA Bundles in this registry, fork that GitHub repository, create the OCA Bundle, and submit a pull request as described in the [Contributing] section of the Aries OCA Bundles website.

[https://bcgov.github.io/aries-oca-bundles/]: https://bcgov.github.io/aries-oca-bundles/
[Contributing]: https://bcgov.github.io/aries-oca-bundles/contributing/CONTRIBUTING/

The content published on the GitHub Pages website from this repo are mostly in the `docs` folder. If you see updates, corrections or additions that are needed, please submit an issue or (better) submit a pull request.

The full source content for the OCA Bundles published from this repo are in the `OCABundles` repository.

There are several scripts in the `scripts` folder that are used to generate OCABundles and the GH Pages site.
