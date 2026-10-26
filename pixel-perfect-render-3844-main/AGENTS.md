<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## 项目规则 / Project rules

- 最高规则文档是根目录 `PROJECT_CONSTITUTION.md`；任何功能实现前先对照它，冲突时以它为准。
- 所有对外文案分三层标注（科学 / 传统文化 / 娱乐解读），避免伪科学权威表述。
- 界面文案中英双语，中文在前，英文在后。

- MVP V1 stores profiles in browser localStorage as append-only versions (src/lib/profileStore.ts); migrate to Lovable Cloud when accounts/payments are added. Why: ship UI first without backend.
