# NereidVLA project website

Research homepage for **NereidVLA: Learning to Understand and Navigate the Underwater World**.

- Website: https://zzq010.github.io/NereidVLA-website/
- Paper: https://arxiv.org/abs/2611.24864
- Research code: https://github.com/SKY-Zhu-91/NereidVLA

## Publish

GitHub Pages publishes the `docs/` directory on the `main` branch. Changes pushed to these files are deployed automatically.

## Local preview

Run `python -m http.server 8765 --directory docs`, then visit http://localhost:8765.

## Edit

- `docs/index.html`: paper content, authors, links, and citation.
- `docs/styles.css`: responsive layout and visual styling.
- `docs/app.js`: experiment comparison, benchmark dimensions, figure lightbox, and citation copying.
- `docs/research-data.js`: complete numerical tables from the paper and original project homepage.
- `docs/assets/`: self-hosted paper images and font.

Research content and figures are from the authors' arXiv paper. Manrope is distributed under the SIL Open Font License; see `docs/assets/OFL-Manrope.txt`.
