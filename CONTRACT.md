# Start Session Contract

## Purpose

The contract turns the session's first request into four checkable commitments that hold for the rest of the session. Its value comes from three things: grounding every field in the real repository instead of generic examples, validating each field against an objective test, and checking the delivered work against the contract. Every rule below serves one of these.

Flow: detect what the user gave, inspect and draft, ask only what is missing, validate, acknowledge, enforce, check each delivery.

## Scope

The contract is per session, not per request or per task. It is agreed once, at the first request of the session, whatever that request is: implementation, bug fixes, docs, scripts, analysis, ideas, suggestions, plans and questions alike. The agent never decides on its own that the first request is too small, too simple or too urgent for a contract. A message with no request in it (a greeting, or `/session-start` alone) does not open the contract; the first actual request does.

After that, the same contract covers the whole session (see "Later requests in the same session"). None of these ever opens a new contract:

* follow-up messages, and new requests on a different subject;
* compaction (the conversation summarized to free up context) and resuming the conversation later: it is still the same session, and the agreed contract still holds;
* the skill being loaded again mid-session with `/session-start`;
* subagents: the work the main session hands them is covered by the main session's contract. Only the main session drafts the contract with the user and checks deliveries against it.

The read-only inspection described in Step 2 happens before the contract is agreed and does not need one.

The only way to skip the contract is the user's explicit waiver, described next.

## Opting out: seguir sem contrato

Only the user can waive the contract, and only explicitly.

* The waiver must name the contract: "seguir sem contrato", "sem contrato", "pode pular o contrato". A plain go-ahead ("ok", "pode ir", "faz aí") confirms the proposed contract and never waives it (see Step 5). Urgency, a small task or a short message is not a waiver either.
* The agent MUST NOT choose this option, assume it or read it from silence. It only reminds the user that the option exists, in one line at the end of the contract block.
* A waiver covers the whole session, just like the contract it replaces. The agent never offers the contract again in that session. If the user later asks for one explicitly ("vamos fazer o contrato"), run the full procedure; that contract then holds for the rest of the session.
* When the user waives it, confirm in one line ("Seguindo sem contrato nesta sessão.") and go on. Every other standing rule still applies.

## Hard rules

1. At the session's first request, the agent MUST NOT answer, modify files, create files, install dependencies, run commands with side effects or begin implementation until all four fields are complete, validated and acknowledged, unless the user explicitly waived the contract.
2. The contract is requested once per session. Once it is agreed or waived, the agent MUST NOT draft a new contract, repeat the confirmation block or re-ask the fields, however different the next request is. The only contract questions allowed afterwards are about a conflict with one specific field (Step 7).
3. The agent MAY and SHOULD inspect the repository before asking anything: read files, search, run read-only git commands, run the existing test, typecheck and lint commands to record a baseline.
4. The agent MUST propose before asking. After inspection it drafts every missing or weak field from what it found, labels each draft `[Minha proposta]`, and asks the user to confirm, edit or replace. A proposal is never treated as the user's requirement until the user confirms it.
5. The agent MUST NOT accept a field that fails its acceptance test (Step 4).
6. The agent MUST enforce the contract for the whole session (Step 7) and check each delivery against it (Step 8).
7. Standing rules (session-start rules, CLAUDE.md, safety and permission rules) remain in force. The contract adds to them and cannot silence them. A conflict is surfaced to the user, never resolved silently.
8. The templates below are in pt-BR, the language of every reply (see "Talk like a person, in Brazilian Portuguese" in SKILL.md).
9. Only the user can waive the contract, explicitly (see "Opting out: seguir sem contrato"). The agent never skips it on its own.

## Step 1: Detect what the user already provided

* Parse the session's first request for the four labels in any order: `Papel`, `Regra`, `Exemplo`, `Critério de sucesso`. Also accept `Role`, `Rule`, `Example`, `Success criteria`.
* A value written under the wrong label is moved to the right field, not rejected. Say so in the acknowledgment ("movi X para Exemplo"). See "Field boundaries".
* Fast path: when all four fields are present and pass Step 4, skip the questions and go straight to Step 6. Still resolve the Exemplo reference and record the baseline.

## Step 2: Inspect and draft

Spend a bounded effort (a handful of reads and searches, not a full audit) to ground the draft:

* Stack and conventions: package manifest, lint and TypeScript config, CLAUDE.md, folder layout.
* Files most likely touched by the first request.
* Candidate references for Exemplo: a similar component, screen, endpoint, hook or test that already does what the request needs.
* Verification tooling: test runner, typecheck, lint, e2e. Run what is cheap and record the baseline, for example "42 testes passando, typecheck limpo". A criterion like "os testes continuam passando" is only checkable against a baseline.

Draft each missing or weak field from these findings. The generic examples in this document are a fallback for when the repository gives nothing to anchor on. When it does, the proposals MUST name real files, components, commands and screens.

## Step 3: Request confirmation

Use one compact block. Ask open questions only where the repository gave nothing. Proposals are labeled `[Minha proposta]`. Every answer line keeps its placeholder in parentheses, so the user knows what to write there. The values in the block below are illustrative: replace them with what Step 2 found, and never present them as the user's requirements.

```text
Antes de começar, preciso fechar o contrato desta sessão. Ele vale para todos os pedidos daqui em diante, então só pergunto uma vez. Já olhei o repositório e preenchi o que dá para inferir. Confirme, edite ou substitua cada campo.

Tarefa (como entendi): [uma linha]

### 1. Papel
Quem devo ser e o que esse papel prioriza quando há conflito?
[Minha proposta] Engenheiro front-end sênior em React + TypeScript; prioriza reutilizar `src/components` antes de criar algo novo.
Outros formatos: "Product Designer focado em UX", "Code reviewer de arquitetura e manutenção", "Full-stack responsável por backend e frontend".

Papel: (cole a minha proposta ou escreva o papel)

### 2. Regra
Quais restrições devo respeitar? Cada regra precisa ser conferível no diff.
[Minha proposta]
1. Não alterar assinaturas exportadas de `packages/ui`.
2. Menor alteração possível; nenhuma dependência nova.
3. Seguir o lint e a estrutura de pastas já configurados.
Acrescente, remova ou substitua. Se não houver regra além das do projeto, responda "Nenhuma regra adicional".

Regra: (cole a minha proposta, escreva as suas regras ou responda "Nenhuma regra adicional")

### 3. Exemplo
Existe uma referência de como o resultado deve funcionar ou ser implementado?
[Minha proposta] Seguir `src/components/UserSelect.tsx`: mesma estrutura de props, mesmo hook de busca, mesmos testes.
Vale um arquivo, uma tela, um fluxo ("a nova tela segue o fluxo de pedidos") ou um comportamento ("quando o usuário fizer X, acontece Y"). Se não houver, responda "Nenhum exemplo disponível".

Exemplo: (cole a minha proposta, indique outra referência ou responda "Nenhum exemplo disponível")

### 4. Critério de sucesso
Como saberemos, de forma observável, que terminou?
[Minha proposta]
1. `pnpm test` e `pnpm typecheck` continuam passando (baseline: 42 testes, 0 erros).
2. O usuário consegue criar, editar e excluir o item pela tela.
3. Nenhuma tela existente muda de comportamento.
Para cada critério vou registrar como verifico (comando ou passo manual). Ajuste ou adicione.

Critério de sucesso: (cole a minha proposta ou escreva como vamos saber que terminou)

Se preferir seguir sem contrato nesta sessão, é só responder "seguir sem contrato".
```

## Step 4: Validate each field

A field is accepted only when it passes its test. Anything else is incomplete.

### Papel

* Shape: discipline + focus (seniority, domain or technology) + what it prioritizes when there is a conflict.
* Test: would two different professionals make different decisions under this role? If the role changes no decision, it is too vague.
* Fails: "Desenvolvedor", "alguém bom". Passes: "Engenheiro de software sênior com foco em arquitetura; prioriza legibilidade sobre performance".

### Regra

* Shape: prohibition or obligation + concrete object + scope. "Não use useEffect", "Não altere nada fora de `src/features/orders`", "Reutilize componentes de `@ignite/ui` antes de criar novos".
* Test: could the agent point to a line of the diff that violates it? If not, it is not a rule.
* Fails: "Faça direito", "seja cuidadoso", "boas práticas". Passes: any rule that names what to do or avoid on a concrete target.
* "Nenhuma regra adicional" is accepted as an explicit answer. Standing rules still apply.
* Lists are welcome. Each item is validated on its own.

### Exemplo

* Shape: a resolvable reference + what to copy from it (structure, names, flow, tests). A file path, a component name, a screen, a URL, or a behavior "quando X, então Y".
* Test: the agent MUST resolve the reference before starting. Open the file or component, confirm it exists and matches the description, and read it. If it does not exist, ask. Never substitute a look-alike silently.
* "Nenhum exemplo disponível" is accepted, but only after the agent has offered a candidate found in the repository.

### Critério de sucesso

* Shape: observable result + how to verify it.
* Test: for each criterion it is clear what to run or what to look at to answer yes or no. Each criterion is classified as automatic (a command the agent runs) or manual (steps the user follows), and the method is written in the acknowledgment.
* At least one criterion MUST be verifiable by the agent itself: a test, a typecheck, a lint run or a reproducible manual check.
* Fails: "Funcionar", "ficar bom", "sem bugs". Passes: "O formulário envia os dados e a API responde 201", "Os 42 testes atuais continuam passando".

### Cross-field checks

All of these MUST hold before acceptance:

* No contradiction between fields, such as Regra "não altere APIs existentes" against Critério "novo endpoint disponível".
* No contradiction with the request as written in the chat.
* No contradiction with the repository, such as an Exemplo that points to a pattern the repository does not use, or a Regra that forbids the only mechanism the codebase offers.
* No conflict with standing rules. If one exists, name it and ask which one wins.

## Step 5: Ask only about what failed

* Blocking: fields that fail their test. Quote the user's words, say in one line why the field fails, and offer two or three options adapted to the repository. Use the generic examples only when the repository gave nothing.
* Non-blocking: fields that pass but could be sharper. State the refinement as `[Minha proposta]`; the user can accept with "ok" or ignore it.
* At most two rounds. In the second round, present the complete contract with every gap filled by a proposal and ask for a single confirmation. A plain go-ahead from the user ("ok", "pode ir", "faz aí") on that round confirms the proposed contract.
* Every round preserves what was already accepted. Never ask again for a field that passed.

### Example of an incomplete contract

User:

```text
Papel: Desenvolvedor
Regra: Faça direito
Exemplo: Nenhum
Critério de sucesso: Funcionar
```

Agent, after inspecting the repository:

```text
Preciso fechar três campos antes de começar: Papel, Regra e Critério de sucesso ainda não permitem decidir nem verificar nada. Já preenchi propostas com base no repositório; basta confirmar ou corrigir.

### Papel
"Desenvolvedor" não muda nenhuma decisão. Opções:
- Engenheiro front-end sênior em React + TypeScript; prioriza reutilização.
- Engenheiro de software sênior focado em arquitetura; prioriza simplicidade.
- Full-stack responsável por backend e frontend; prioriza contrato de API estável.

### Regra
"Faça direito" não é conferível no diff. Minha proposta, com base no que já existe no projeto:
1. Não alterar código fora de `src/features/orders`.
2. Reutilizar componentes de `src/components` antes de criar novos.
3. Não adicionar dependências.

### Exemplo
Você respondeu "Nenhum". Encontrei `src/features/products/ProductForm.tsx`, que faz um fluxo parecido. Posso usar como referência? Se não, responda "Nenhum exemplo disponível".

### Critério de sucesso
"Funcionar" não diz o que observar. Minha proposta:
1. `pnpm test` continua com 42 testes passando (automático).
2. O formulário de pedido salva e a lista mostra o novo pedido (manual, passos abaixo).
3. As telas de produtos não mudam de comportamento (automático, via testes existentes).

Confirme ou ajuste esses campos.
Se preferir seguir sem contrato nesta sessão, é só responder "seguir sem contrato".
```

## Step 6: Acknowledge

Echo Regra and Critério de sucesso in the user's own words, not a paraphrase; paraphrase drifts. Show where Exemplo was resolved. Restate the task in one line. The task line is a header, not a fifth field.

```text
Contrato definido.

Tarefa: [uma linha, nas palavras do usuário]

Papel: [texto final]

Regra:
1. [texto final]
2. [texto final]

Exemplo: [referência] (conferido em `caminho/do/arquivo`)

Critério de sucesso:
1. [texto final] | verificação: `comando` (automática)
2. [texto final] | verificação: [passos] (manual)

As regras permanentes da sessão continuam valendo.
Vou usar este contrato em todos os pedidos desta sessão, sem pedir outro. Começando.
```

Work may start after this message.

## Step 7: Enforce during the session

* Before each non-trivial decision in any request of the session (new file, new dependency, change outside the expected area, deviation from Exemplo), check it against Regra and Exemplo.
* If a rule cannot be followed or a criterion cannot be met, stop, explain why, propose an amendment to the affected field only, and wait. Never deviate silently.
* If new information contradicts a field (the Exemplo turns out not to fit, a criterion becomes impossible), propose an amendment to that field only. Unaffected fields stay as agreed. A new request from the user is not such information: it follows the contract as agreed.

## Step 8: Check each delivery against the contract

Every reply that completes a request which changed files or produced a deliverable MUST end with the check below. List every Regra item (items this delivery could not have affected share one line: "Regras 2 e 3: não se aplicam a este pedido"), and the Critério de sucesso items the delivery affects; a criterion that guards the whole session, such as a baseline test command, is re-run whenever code changed. When the delivery falls outside every criterion, add one line saying how it was verified. A plain answer to a question needs no check, unless the Critério de sucesso was written for that answer.

A criterion is marked as verified only with evidence: the command and its result, or a reproduced manual check. Anything not verified is reported as pending, with the steps the user needs.

```text
Conferência do contrato

Regra:
1. [regra]: cumprida (evidência: ...)
2. [regra]: não cumprida (motivo e o que foi feito no lugar)

Critério de sucesso:
1. [critério]: verificado (`comando`, resultado)
2. [critério]: verificação manual pendente (passos: ...)

Fora dos critérios, [o que foi entregue]: verificado (`comando`, resultado)
```

## Later requests in the same session

Every request after the first is covered by the session contract, whatever its size or subject, even when it starts a different piece of work.

* Do it directly: no new contract, no confirmation block, no "mantenho Papel e Regra?".
* Papel and Regra apply to every request. Exemplo applies whenever the request touches what it references. Critério de sucesso applies to the work it describes; a request outside it is verified with its own evidence (Step 8).
* Stop only when the request cannot be done without breaking a Regra, or contradicts another field. Ask one short question about that field alone, and wait: "Isso mexe fora de `src/features/orders`, o que a Regra 1 proíbe. Abro uma exceção só para este pedido?". Never turn that question into a new contract.
* The user may add to or change any field at any moment by writing it ("Regra: também não mexer em `packages/ui`"). From then on the new value holds: validate that field alone (Step 4) and confirm in one line.
* A full new contract is drafted only when the user explicitly asks for one ("vamos fazer um contrato novo").

## Field boundaries

The four fields serve different purposes:

* Papel defines a perspective.
* Regra defines constraints.
* Exemplo defines a reference.
* Critério de sucesso defines the expected outcome.

One field never substitutes for another. When a value lands in the wrong field, move it and say so:

* "Faça igual ao componente X" is an Exemplo, not a Regra.
* "Não crie um componente novo" is a Regra, not a Critério de sucesso.
* "O usuário deve conseguir editar o registro" is a Critério de sucesso, not a Papel.
* "Priorize simplicidade" belongs to what the Papel prioritizes, not to Regra. The Regra version would be "não crie abstrações com um único uso".

Keep the distinction because each field is checked differently: Papel guides decisions, Regra is checked on the diff, Exemplo is resolved in the repository, Critério de sucesso is verified in each delivery's check.
