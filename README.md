# EXAMINATIONSUPPGIFT

## EGNA TANKAR
Det blev lite spagettikod här och var, lite på grund av omständigheter hemma så man kan inte riktigt skylla ifrån sig. 

För att projektet ska fungera i sin helhet när man klonar sidan så får man lägga till ***secretData.js*** i **script** mappen. där får man skriva in: 

```
const apiKey = <YOUR-OMDB-API-KEY>;
export default apiKey;
```


## Uppgift

Uppdraget är att skapa en webbapplikation som liknar IMBD (Internet Movie Database) där användare kan söka efter filmer, visa detaljerad information om filmer och lägga till sina favoritfilmer med mera.

## Tekniska Krav

### För godkänt

* På startsidan MÅSTE man presentera 5 slumpmässiga trailers, samt hela topplistan för IMDBs 20 högts rankade filmer. Denna information läser man in från mitt filmAPI.
* Det MÅSTE finnas sökfunktionalitet. Vid sökning skall strängen från inputfältet användas för att göra en bred sökning i OMDB-APIet.
* Sökresultaten MÅSTE presenteras för användaren på ett tillfredsställande sätt där man exempelvis kan skapa ett "kort" per film innehållandes titeln, samt en poster. (Det är också tillåtet att presentera sökresultaten i en automatisk lista med förslag på den input som användaren skriver in i sökfältet)
* Vid klick på ett sökresultat MÅSTE man göra en ny, mer specifik sökning på OMDB-APIet göras, baserat på den klickade filmens ImdbID. (Mer info om de olika sökningarna för APIet kommer nedan). Detta anrop kommer returnera mer specifik information om filmen som ni skall presentera för användaren (antingen på startsidan, eller på en egen sida).
* Man MÅSTE koda tillgängligt, dvs. alla bilder måste ha ALT-taggar, överanvänd inte DIV-element där de inte fyller någon funktion osv. Er sida kommer att granskas med ett tillgänglighetsverktyg (se nedan), där onödiga övertramp och Errors inte kommer att godkännas.
* Man MÅSTE använda er av felhantering vid era API-anrop.
* Man MÅSTE skapa en responsiv webbplats. Inga element får sticka ut över kanter, eller utanför skärmen.
* Er webbplats MÅSTE ha ett acceptabelt utseende (man får använda mitt template).

### För Väl Godkänt
* Skapa funktionalitet för att lägga till/ta bort filmer i en favoritlista (använd localStorage för detta). Dessa filmer skall även kunna visas för användaren (tex som i mitt exempel, men kan även göras på en ny sida).
* Använda er av MINST 2 moduler utöver er huvudjavascript-fil (alltså minst 3 javascript-filer totalt).



