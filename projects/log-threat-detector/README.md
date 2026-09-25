# Python Log Threat Detector

A Python program that analyses authentication logs and looks for patterns that could indicate suspicious activity. The project focuses on using Python to process log data, track activity by IP address and generate alerts when certain conditions are met.

The detector currently checks for repeated failed logins, rapid brute-force attempts, successful logins after repeated failures, blacklisted IP addresses and multiple usernames being used from the same IP.

## How It Works

The program reads `sample.log` one line at a time and extracts the timestamp, event type, username and IP address.

For example, a log entry looks like:

```text
2026-08-28T14:01:10 FAILED_LOGIN user=bob ip=192.168.1.30
```

The individual parts are extracted in Python using:

```python
parts = line.split()

timestamp = datetime.fromisoformat(parts[0])
event_type = parts[1]
user = parts[2].split("=")[1]
ip = parts[3].split("=")[1]
```

`datetime.fromisoformat()` converts the timestamp into a Python `datetime` object, which allows timestamps to be compared when checking how quickly login attempts occurred.

## Threat Detection

### Repeated Failed Logins

Failed login timestamps are stored separately for each IP using a `defaultdict` containing lists:

```python
failed_attempts = defaultdict(list)
```

Every failed login is added to the list belonging to its IP:

```python
failed_attempts[ip].append(timestamp)
```

If an IP reaches 3 failed attempts, an alert is generated:

```python
FAILED_THRESHOLD = 3
```

This is used to identify possible brute-force activity.

### Rapid Brute-Force Attempts

The program also checks how many failed attempts occurred within a 60-second window.

```python
WINDOW_SECONDS = 60
```

The timestamps are filtered using:

```python
recent = [
    t for t in attempts
    if (timestamp - t).total_seconds() <= WINDOW_SECONDS
]
```

If 5 or more failed attempts occurred within the window, the IP is flagged as a rapid brute-force attempt.

### Successful Login After Repeated Failures

A successful login is checked against the number of previous failed attempts from the same IP.

```python
if (
    event_type == "SUCCESS_LOGIN"
    and len(failed_attempts[ip]) >= FAILED_THRESHOLD
):
```

This generates an alert because a successful login following several failures could be worth investigating.

### Blacklisted IPs

A set is used to store IP addresses that should be flagged:

```python
BLACKLISTED_IPS = {"10.0.0.5"}
```

The program checks whether each IP is in this set:

```python
if ip in BLACKLISTED_IPS:
```

If it is, an alert is generated.

### Multiple Usernames From One IP

The program also records the different usernames used by each IP.

A set is used so that the same username is only counted once:

```python
users_per_ip = defaultdict(set)

users_per_ip[ip].add(user)
```

After processing the log, an IP is flagged if it has attempted to use at least 3 different usernames. This could indicate credential-stuffing behaviour or attempts to access multiple accounts.

## Example Input

The `sample.log` file contains different login events so that each detection rule can be tested.

![sample.log file contents](images/screenshots/sample_log.png)

## Example Output

Running `main.py` displays the alerts in the VS Code terminal.


![VS code terminal when main.py executed](images/screenshots/terminal.png)

The alerts include the IP address involved and the reason it was flagged.

## Threat Report

The detected alerts are also saved to:

```text
reports/threat_report.txt
```

The report is created using Python file handling:

```python
with open("reports/threat_report.txt", "w") as report:
    for event in suspicious_events:
        report.write(event + "\n")
```

This means the results can be reviewed after the program has finished running.

### Screenshot 3 — `threat_report.txt`

![Threat report text file displaying threats](images/screenshots/threat_report.png)

## Project Structure

```text
python-log-threat-detector/
│
├── main.py
├── sample.log
├── requirements.txt
│
└── reports/
    └── threat_report.txt
```

`main.py` contains the detection logic, `sample.log` contains the authentication data being analysed, and the `reports` folder stores the generated results.

The project uses only Python's built-in modules, so `requirements.txt` does not currently contain any external dependencies.

## Skills Demonstrated

### Python

* File handling and I/O
* Loops and conditional statements
* Lists, sets and dictionaries
* `defaultdict`
* String manipulation and parsing
* `datetime` and timestamp comparison
* Writing output to files

### Cybersecurity

* Authentication log analysis
* Brute-force detection
* Rapid login detection
* IP address analysis
* Blacklist checking
* Suspicious login detection
* Basic anomaly detection
* Security alert generation

## How to Run

From the project directory, run:

```bash
python main.py
```

The detected alerts will be displayed in the terminal and saved to:

```text
reports/threat_report.txt
```
