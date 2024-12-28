# Gruppenteilnehmer:
- 30252910
- 30245851
- 30248849

# Vorgehensweise
- Erstellung von Testfällen für das Frontened
- Erstellung von Testfällen für das Backend
- Anlegen der Github-Action
- Test der Github-Action (Wird sie bei einem Pull-Request ausgeführt?)
- Anlegen eines Sonarqube-Projekts
- Integration von Sonarqube in die Github-Action (Einfügen von sonarqube.yaml)

# gewählte Lösungen
- Die Testfälle für das Frontend wurden in der todo_spec.js-Datei im Pfad cypress/integration erstellt. Dabei wurde auf eine möglichst hohe Abdeckung der Anwendung geachtet.
- Die bereits vorhandenen Testfälle für das Backend wurden etwas erweitert, um die Funktionalität tiefer zu testen.
- Die Github-Action wurde mit Hilfe der Dokumentation angelegt und mittels Push und Pull an/von das Repository getestet. Diese wurde auch ausgeführt, allerdings schlug sie aufgrund nicht erfolgreicher Tests fehl.
- Das Sonarqube-Projekt wurde auf der Seite der FH angelegt. Dabei wurde zuerst ein lokales Projekt angelegt und die entsprechenden Secrets im Repository eingepflegt.


# Probleme - Lösungen und Erklärungen

## Korrektur der Anwendung
### GET /todos (unauthorisiert)
- erwartet wird Code 401, es wird aber 200 zurückgegeben
- Methode zur Dummy-Authentifizierung war nicht implementiert, wenn kein Token bereitgestellt wird
## Post /todos
- Der Test für unvollständige Todo-Einträge schlug fehl, da die API einen 201-Statuscode anstatt des erwarteten 400-Statuscodes zurückgab.
- Die POST /todos Route wurde um eine Validierung erweitert, die unvollständige oder ungültige Todo-Einträge abfängt und einen 400 Bad Request Statuscode zurückgibt.

## Github-Action
- Die Github-Action wurde zuerst nicht korrekt ausgeführt
- in der yaml-Datei wurden Syntax und Formatierungsfehler gemacht, wodurch die korrekte Ausführung verhindert wurde
- nach Korrektur der Fehler wurde die Action korrekt ausgeführt, auch wenn sie aufgrund von Fehler in den Tests fehlschlug

## Sonarqube
Die Integration von Sonarqube war leider nicht möglich. Bei der Erstellung des Projektes ist nur Zugriff auf Repositories der FH möglich, daher wurde ein lokales Projekt erstellt. Die entsprechenden Secrets wurden dann erstellt und im Repository eingegeben. Leider war trotzdem kein Zugriff auf das Repository möglich. Daher erfolgte eine Recherche, bei der ein Transfer des Repositories in die FH-SWF-Organisation vorgeschlagen wurde. Dies wurde entsprechend vollzogen und das Projekt konnte bei Sonarqube als Projekt angelegt werden. Leider stellte sich dabei heraus, dass es nach dem Transfer nicht mehr möglich war, die Einstellungen des Repositories zu erreichen, wodurch keine Eintragung der Secrets mehr möglich war.

# Ergebnisse der automatisierten Tests und SonarQube-Analysen

Abschließend eine Übersicht über die vorhandenen Tests. Leider konnten für die fehlgeschlagenen Tests keine Lösungen gefunden werden. Hauptsächlich waren Validierungsregeln von den Tests betroffen, die nach unserert Meinung korrekt implementiert sein sollten, aber trotz dessen nicht korrekt ausgeführt bzw. erfolgreich getestet werden konnten.

GET /todos (unautorisiert)
    ✓ sollte einen 401-Fehler zurückgeben, wenn kein Token bereitgestellt wird (11 ms)
  GET /todos
    ✓ sollte alle Todos abrufen (14 ms)
  POST /todos
    ✓ sollte ein neues Todo erstellen (17 ms)
    ✓ sollte einen 400-Fehler zurückgeben, wenn das Todo unvollständig ist (4 ms)
    ✕ sollte einen 400-Fehler zurückgeben, wenn das Todo nicht valide ist (7 ms)
  GET /todos/:id
    ✓ sollte ein Todo abrufen (8 ms)
    ✓ sollte einen 404-Fehler zurückgeben, wenn das Todo nicht gefunden wurde (14 ms)
  PUT /todos/:id
    ✓ sollte ein Todo aktualisieren (9 ms)
  DELETE /todos/:id
    ✓ sollte ein Todo löschen (12 ms)
  POST /todos (erweiterte Validierung)
    ✕ sollte einen 400-Fehler zurückgeben, wenn der Titel zu kurz ist (3 ms)
    ✕ sollte einen 400-Fehler zurückgeben, wenn das Datum ungültig ist (3 ms)
  POST /todos (Grenzwerte)
    ✓ sollte ein Todo mit maximal erlaubter Titellänge erstellen (5 ms)
    ✕ sollte einen 400-Fehler zurückgeben, wenn der Status außerhalb des gültigen Bereichs liegt (3 ms)