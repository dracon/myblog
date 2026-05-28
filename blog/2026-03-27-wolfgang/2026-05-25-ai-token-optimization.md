---
slug: "fra-copilot-til-kollega-del-1-smartere-agenter-starter-med-slanke-instruksjoner"
title: "Fra Copilot til Kollega — Del 1: Smartere agenter starter med slanke instruksjoner"
date: 2026-05-25
description: "Den første artikkelen i serien om AI-tokenoptimering"
authors: [wolfgang, claude]
---

# Fra Copilot til Kollega — Del 1: Smartere agenter starter med slanke instruksjoner

*Den første artikkelen i serien · 1 av 5*

## Forord

AI-utviklingen går enormt raskt, og med den følger både muligheter og kostnader. Jeg startet som skeptiker, men etter å ha prøvd Anthropic Claude og Claude Code — og verdsatt Anthropics prinsippfaste holdning til personvern og etikk — ble jeg raskt fascinert av potensialet.

Etter hvert oppdaget jeg at AI-bruk kan bli dyrt, og begynte å lete etter måter å optimere på. Denne serien handler om nettopp det: hvordan vi kan bruke AI effektivt og kostnadsbevisst, uten å gå på akkord med sikkerhet, personvern eller kvalitet.

---

Du åpner en ny agentøkt i GitHub Copilot. Du beskriver oppgaven og ser agenten komme i gang. Det går raskt — frem til det ikke lenger gjør det. Etter en time begynner agenten å stille spørsmål du allerede har svart på. Den foreslår kode som strider mot beslutninger fra tjue minutter siden. Kostnadene stiger og du vet ikke helt hvorfor.

Dette er ikke en feil. Det er **context rot** — kontekstforråtnelse — og det er den vanligste grunnen til at AI-agentøkter havarerer i profesjonelle team. Den gode nyheten: det er fullt mulig å forhindre.

Denne artikkelen er en praktisk guide til å få mer ut av AI-agentene dine ved å gi dem mindre — mindre støy, mindre oppblåsthet, mindre irrelevant historikk. Vi ser på hvordan du skriver strammere instruksjoner på alle fire konfigurasjonsnivåer (organisasjon, repository, IDE og bruker), når du bør komprimere kontra nullstille, og hvordan du bruker skills på riktig tidspunkt. Artikkelen er skrevet for team som bruker **GitHub Copilot Enterprise** i VS Code — men prinsippene gjelder like godt for JetBrains AI og Claude Code.

---

## Hvorfor tokens betyr mer enn du tror

Hver melding du sender en AI-agent, hver fil den leser, hvert verktøy den kaller — alt koster tokens. Tokens er den «arbeidsminne»-enheten modellen opererer med. Når kontekstvinduet fylles opp, skjer én av to ting: agenten komprimerer alt automatisk (og mister ofte informasjon du trengte), eller økten stopper opp.

Fra juni 2026 gikk GitHub Copilot over fra forespørselsbasert til **bruksbasert fakturering**. Hvert token teller nå direkte mot kostnadene. Konsekvensen for profesjonelle team er konkret: slappe kontekstvaner skader ikke bare kvaliteten — de skader budsjettet.

**Kjerneprinsippet: mer kontekst = flere tokens = høyere kostnad og lavere kvalitet.** Å optimalisere agentoppsettet handler ikke om å kutte hjørner — det handler om å gi modellen nøyaktig det den trenger for å gjøre utmerket arbeid.

---

## 1. De fire konfigurasjonsnivåene — og hva hvert nivå bør inneholde

GitHub Copilots konfigurasjon er hierarkisk: organisasjonspolicyer setter taket, repositoryinstruksjoner setter teamstandarder, IDE-innstillinger styrer hva agenten ser lokalt, og brukerinnstillinger håndterer personlige preferanser. Hvert nivå har en distinkt rolle — og en distinkt tokenkostnad.

### Organisasjonsnivå (GitHub Settings → Copilot → Policies)

Dette er det eneste nivået som ikke kan overstyres. Det definerer hva som er tillatt i det hele tatt. Fra et tokenperspektiv er de viktigste innstillingene her:

- **Foretrukket modell:** Lås til `claude-sonnet-4-6` — den nåværende stabile modellen med best kostnad/ytelse-ratio. La ikke utviklere falle tilbake til tyngre modeller for rutineoppgaver.
- **MCP-servere:** Kun hviteliste. Hvert MCP-verktøyskjema som lastes inn i en agentøkt koster 100–500 tokens *per agenttrinn*. Å blokkere ikke-godkjente servere på org-nivå forhindrer token-lekkasje fra verktøy ingen ba om.
- **Cloud Agent og tredjepartsagenter:** Deaktivert. Autonome agenter som spawnes uten eksplisitt oppgavescope vil utforske bredt og bruke tokens deretter.

### Repositorynivå (.github/copilot-instructions.md)

Denne filen lastes inn i **hver eneste interaksjon** i repositoriet ditt. Hvert ord du legger til koster tokens på hver forespørsel, multiplisert med hvert agenttrinn, multiplisert med hver utvikler på teamet. Skriv den som om den er dyr — for det er den.

Den beste innrammingen: behandle denne filen som en **feilsporer, ikke en wiki.** Den skal kun inneholde ting agenten ville gjøre feil uten å bli fortalt det. Ikke generelle beste praksiser den allerede kjenner fra opplæringen — bare teamets spesifikke regler, kanttilfeller og begrensninger.

**Dårlig instruksjon (sløser tokens på hver forespørsel):**
```
Skriv alltid ren, lesbar kode som følger beste praksis.
Bruk meningsfulle variabelnavn og hold funksjoner korte.
```
Agenten vet dette. Slett det.

**God instruksjon (fortjener plassen):**
```
Bruk aldri den gamle UserAuth-modulen — bruk AuthService fra /src/services/auth.
Alle databasespørringer må gå gjennom QueryBuilder-innpakingen, ikke rå SQL.
Bruk alltid parameteriserte spørringer — aldri strengkonkatenert SQL.
Kjør `npm run test:integration` før en oppgave markeres som fullført.
```
Dette er landminer agenten ville tråkke på uten veiledning.

**Outputkontroll er ditt viktigste virkemiddel.** Output-tokens koster omtrent fem ganger mer enn input-tokens. Én linje i instruksjonsfilen kan redusere output-kostnadene med 40–70 % på kodeoppgaver:

```
Svar med kode kun. Ingen forklaringer med mindre jeg eksplisitt ber om det.
```

Repositoriet støtter også avgrensede instruksjonsfiler under `.github/instructions/` — for eksempel `security.instructions.md` og `testing.instructions.md`. Bruk disse for domene-spesifikke regler som bare gjelder sikkerhetssensitive eller testrelaterte oppgaver, i stedet for å laste alt inn i hovedfilen hver gang.

### IDE-nivå (.vscode/settings.json)

Denne filen bør committes til versjonskontroll slik at hele teamet bruker identiske innstillinger. De mest token-relevante innstillingene:

```json
{
  "github.copilot.advanced": {
    "ignore_patterns": {
      "**/.env": true,  "**/.env.*": true,
      "**/secrets.json": true,
      "**/*.key": true, "**/*.pem": true,
      "**/.aws/**": true, "**/.ssh/**": true,
      "**/node_modules/**": true
    },
    "preferredModel": "claude-sonnet-4-6",
    "chatContextWindow": 5000
  },
  "github.copilot.sendWorkspaceContext": false,
  "github.copilot.mcp.enabled": false
}
```

**`sendWorkspaceContext: false`** er kritisk: det forteller Copilot å sende kun markørkontext, ikke hele arbeidsområdet. På store repoer er dette den enkeltinnstillingen med høyest tokenreduksjonseffekt på IDE-nivå.

**Hold åpne editorfaner minimale.** Copilot inkluderer kontekst fra åpne filer i hver forespørsel. Fem unødvendige åpne faner kan legge til tusenvis av tokens på hver interaksjon — uten noen fordel.

**Deaktiver Copilot for filtyper den ikke kan hjelpe med:** XML, YAML, `.properties`, autogenererte filer. Disse bruker indekseringstokens stille i bakgrunnen.

### Brukernivå (~/.copilot/settings.json)

Denne filen lever på hver utvikleres maskin og committes aldri til git. Den håndterer personlige preferanser og godkjenningsatferd. Hold den fokusert på sikkerhetssperrer:

```json
{
  "permissions": {
    "requireApprovalFor": {
      "bash": true,
      "shell": true,
      "delete": true
    },
    "deniedCommands": ["sudo", "rm -rf /", "git push --force"]
  },
  "telemetry": { "enabled": false },
  "context": {
    "excludePatterns": [".env*", "*.key", ".aws/**", ".ssh/**"]
  }
}
```

Ekskluderingsmønstrene her fungerer som en andre forsvarslinje mot at hemmeligheter lekker inn i konteksten — og forsterker det som allerede er satt i `.vscode/settings.json`.

---

## 2. Context rot: hvordan du kjenner det igjen og hva du gjør

**Tegn på at konteksten har blitt dårlig:**
- Agenten stiller spørsmål du allerede har svart på
- Den foreslår en tilnærming du eksplisitt avviste tidligere
- Svarkvaliteten faller merkbart midt i en økt
- Du ser en plutselig kostnadstopp i brukspanelet
- Du ser `[context compacted]` i terminalen (Claude Code)

Når disse dukker opp, er det på tide å handle — ikke vente.

### Komprimering: kontrollert kompresjon

Komprimering sammenfatter hele samtalehistorikken til et kortfattet sammendrag — beslutninger og filtilstander bevares, mens prosess-støy fjernes: midlertidige feilsøkingsutdata, løste feil, utforskende frem-og-tilbake.

**Når du bør komprimere:**
- Når kontekstmåleren nærmer seg 60–70 % kapasitet — ikke 95 %
- Etter at du har fullført en større deloppgave i en lengre økt
- Når økten fortsatt er produktiv, men begynner å bli tung

Nøkkelen er å gjøre det **bevisst**. Å komprimere proaktivt lar deg påvirke hva som bevares. Venter du til kontekstvinduet fylles av seg selv, bestemmer modellen — og den kaster ofte arkitekturelle beslutninger mens den beholder trivielle utdata.

**I Claude Code, styr komprimering via `CLAUDE.md`:**
```markdown
## Compact Instructions
Når du komprimerer, bevar alltid:
- Den fullstendige listen over endrede filer
- Alle testkommandoer brukt i denne økten
- Viktige arkitekturelle beslutninger og begrunnelse
- Eventuelle begrensninger eller regler som er eksplisitt diskutert
```

Du kan også sette en egendefinert komprimeringsprompt i `~/.claude/settings.json`:
```json
{
  "compactPrompt": "Bevar ALLE regler fra CLAUDE.md ordrett. Behold filstier, feilmeldinger og arkitekturelle beslutninger. Forkast midlertidige feilsøkingsutdata og løste diskusjoner."
}
```

### Nullstilling: når du starter helt på nytt

Nullstilling fjerner alt — ingen historikk, ingen akkumulert kontekst, en frisk økt.

**Når du bør nullstille:**
- Du har fullført én oppgave og starter på noe urelatert
- Økten har sporet av og er full av mislykkede forsøk
- Du bytter mellom forskjellige deler av kodebasen uten felles kontekst

Konteksten fra å fikse en betalingsfeil hjelper ikke med å refaktorere autentiseringsmodulen. Å starte på nytt forhindrer krysskontaminering og gir deg ofte et bedre svar raskere.

**Enkel tommelfingerregel:**
> Samme oppgave, trenger minneoppdatering → komprimer
> Ny oppgave, annen kontekst → nullstill

---

## 3. MCP-servere: deaktiver det du ikke aktivt bruker

MCP-konfigurasjonen (`~/.copilot/mcp-config.json`) bør ha GitHub MCP-serveren aktivert og filsystem- og databaseserverne deaktivert som standard. Dette er riktig utgangspunkt. Hvert verktøyskjema som lastes inn i en agentøkt koster tokens på hvert trinn — 15 aktive servere gjennom en oppgave på 15 trinn kan legge til over 200 000 tokens i ren overhead.

**Hva du bør gjennomgå jevnlig:**
- Brukes alle aktiverte servere aktivt?
- Matcher hvert servers tillatelsesomfang det som faktisk trengs? (Kun lesing er nesten alltid tilstrekkelig.)
- Er `allowAutoInstall: false` og `sandboxed: true` fortsatt satt?

GitHub MCP-serveren (lese-tilgang til repository — issues, PRs, kodesøk) rettferdiggjør tokenkostnaden for de fleste team. Filsystem- og databaseserverne bør holdes deaktivert til det finnes et spesifikt, avgrenset brukstilfelle — og selv da, bare for den aktuelle oppgaven.

---

## 4. Skills: last dem bare inn når du trenger dem

Skills utvider hva en agent kan gjøre. Fellen er å laste alle inn hele tiden.

I GitHub Copilot oppdages skills automatisk fra `.github/skills/`, `.claude/skills/`, eller `~/.copilot/skills/`. Copilot laster skill-*beskrivelser* ved øktstart slik at modellen vet hva som er tilgjengelig — men laster bare fullt innhold når en skill faktisk brukes.

**Praktisk disiplin:**
- Hold skill-beskrivelser korte og presise. En vag beskrivelse får agenten til å laste skillen spekulativt, og bruker tokens på oppgaver der den ikke trengs.
- For skills som gjelder spesifikke deloppgaver (sikkerhetsgjennomgang, testgenerering, databasemigrering): ikke legg de fulle reglene inn i `copilot-instructions.md`. La dem leve som skills og lastes ved behov.
- Bruk `/skills`-kommandoen i VS Code-chatten for å bekrefte hvilke skills Copilot kan se i arbeidsområdet ditt.

---

## Hva du bør gjøre denne uken

Gjennomgå `.github/copilot-instructions.md`. Fjern alt agenten allerede vet fra generell opplæring — prinsipper for ren kode, generelle navnekonvensjoner, standardmønstre. Det som gjenstår, bør være teamets faktiske miner: de spesifikke reglene, modulene og begrensningene som er unike for kodebasen din.

Bekreft deretter at `sendWorkspaceContext: false` er i den committede `.vscode/settings.json`. Hvis den ikke er det, vil den ene endringen redusere tokenforbruk på hver forespørsel fra hver utvikler på teamet.

Dette er små endringer. Den akkumulerte effekten på tvers av et team av utviklere, gjennom hundrevis av økter per uke, er det slett ikke.

---

*Neste uke: AI er ikke lenger valgfritt — Hvordan enterprise-arkitektur bygges om rundt kunstig intelligens.*

---

*Den AI-First Profesjonelle er en femdelers serie for teknologipraktikere som navigerer overgangen fra AI-verktøy til AI-drevne arbeidsflyter.*
