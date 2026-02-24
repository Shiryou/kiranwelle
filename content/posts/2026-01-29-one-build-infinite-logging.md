---
title: "One Build, Infinite Logging: Configuration Over Compilation"
comments: true
date: 2026-01-29 16:37:22 -0800
tags: [BirP, logging]
categories: [Birthright]
series: ["rebuilding-birthright-the-gorgons-alliance"]
---

As you can probably imagine, the philosophy of software development has evolved dramatically since the early 90s when Birthright was in active development. With limited memory and CPU power available, performance was key and the public was generally less tech aware than the average person today. Communicating directly with users was time consuming and frustrating due to slow Internet speeds, very basic communication tools, and not everyone having access to the Internet at all.

For these reasons, software companies saw logging as a strictly internal tool, restricted to debug builds that would never see the light of day. User-facing error messages were generic and unhelpful and often times software simply crashed citing an incomprehensible memory address as the culprit. End users were not only expected to not understand error messages, but it was encouraged not to show them any details at all. The details wouldn't be helpful to them and would only make the game look unpolished and janky.

Today, gamers are often tech savvy and communicate bug reports directly to game companies over GitHub, Discord, or forums with WYSIWYG editors supporting code formatting. With the rise of early access gaming, users are more a part of the development process than ever before. With the availability of [PCGamingWiki][pcgw], players are directly tweaking configuration files and making technical changes to their games to get them running.

## Birthright's Logging Systems

The Birthright source code is sprinkled here and there with logging messages. There are messages all the way from fatal errors, warnings, information, and even some lower level debugging logs using three or even four different logging routes:

1. printf
2. RandomLog
3. MonoDevice
4. DEBUG.C/STATUS.C

**printf** is a very standard, "low brow" way of doing logging. You'll find discussion in every programming community about these kinds of logging messages. In a console application, this writes text to the console window. In windowed applications, I think this generally goes to an invisible console, but Birthright had it redirect to `rand.log`. I didn't actually see a mechanism for the redirect, which was odd.

Interestingly, the only thing keeping the game from logging in release builds was that `printf` was redefined to just:

```cpp
#if defined(_RELEASE)
// for the release version, we don't want any printf's
int	printf( const char *__format, ... )
{
	return 0;
}
#endif
```

Some might recall, this caused me issues when I was trying to [compile the game with OpenWatcom][kw-defunct]. Reimplementing the logging system is the first step towards moving to OpenWatcom and away from Watcom 10.6.

**RandomLog** was intended to write to a log file with a randomized name for each time the game starts, but I couldn't find any trace of the randomization actually being enabled. Birthright just happily wrote to a hard coded filename of `rand.log`.

**MonoDevice** wrote log messages to `\\\\.\\DARKMONO.VXD`, which tells me it might have been writing to a logging application or system outside of Birthright. This is primarily used in multiplayer logging.

**DEBUG.C** and **STATUS.C** write messages to the game's title bar and status bar, respectively. I wasn't able to get the status bar to show, so it's possible the code wasn't fully implemented. This is also primarily used in multiplayer logging, although almost all of it was commented out in the original code.

Most of these different logging "systems" get replaced by printf in release builds, which is replaced by an empty function, or they're disabled by compiler settings.

## What's the problem?

While it's obviously overly complex and requires adjustment, most people are probably thinking "Great. Move them all to the log file, make sure they're turned on, and call it a day!" That's a great start, but it doesn't give us the kind of flexibility, insight, and control that I expect from a good logging system.

With those changes, we have a log file full of messages that might not be relevant to what we're doing, take up extra space, and use up system resources. While we want access to all of the logging, we also don't want to clog up system resources that might slow the game down.

We want to do the following:

1. Provide levels of logging to stem the tide of debug information when you just want a casual game session.
2. Ensure the log file is updated promptly, so that a crash doesn't go unlogged.
3. Make it easy to change the logging level, so that players can help track down bugs and report them.
4. Make it easy to find the relevant error(s) in the log file.
5. Encourage logging in the code so that errors are easier to track down during development.

## Explaining the system

The approach I'm using is very similar to logging frameworks I've used in C# and PHP, but in a pared down, simplified way. We're working in C++, but some of Birthright's source is in C and we need to be able to log in both. I would normally implement this using classes, which I'll discuss later, but we don't have access to that.

The obvious part comes first. We create our `logMessage` function to take a string and write it to a file. You'll notice we're actually losing functionality compared to `printf`, but we'll get to that later.

```cpp
FILE *logFile;
char *logFileName = "debug.log";

int openLogging()
{
	logFile = fopen(logFileName, "a");
	if (logFile == NULL) {
		perror("Unable to initialize logging.");
		abort();
	}
	return logFile != NULL;
}

int closeLogging()
{
	if (logFile != NULL) {
		fclose(logFile);
		return 1;
	}
	return 0;
}

void logMessage(const char *message)
{
	if (!openLogging()) {
		return;
	}

	if (logFile)
	{
		// Get and format the current time
		time_t now = time(NULL);
		struct tm *localTime = localtime(&now);
		char datetime[100];
		strftime(datetime, sizeof(datetime), "%Y-%m-%d %H:%M:%S", localTime);

		fprintf(logFile, "[%s] %s\n", datetime, message);
		fflush(logFile);
	}
	closeLogging();
}
```

Opening and closing the log file for every message is terribly inefficient, but it gives us fault tolerance. If the application crashes, we don't have to worry about losing error messages in the buffer. This completes #2.

```cpp
typedef enum {
	LogTrace,
	LogDebug,
	LogInfo,
	LogWarn,
	LogError,
	LogFatal,
	LogMeta
} LogLevel;

LogLevel currentLogLevel;
#if defined(_DEBUG)
LogLevel defaultLogLevel = LogDebug;
#else
LogLevel defaultLogLevel = LogWarn;
#endif // defined

void setLogLevelFromString(const char *level)
{
	setLogLevel(logLevelToEnum(level));
}

void setLogLevel(LogLevel level)
{
	LogLevel oldLevel = currentLogLevel;
	currentLogLevel = level;
	logMeta("Changing logging from %s to %s.", logLevelToString(oldLevel), logLevelToString(currentLogLevel));
}

const char* logLevelToString(LogLevel level)
{
	switch (level) {
		case LogTrace: return "TRACE";
		case LogDebug: return "DEBUG";
		case LogInfo:  return "INFO";
		case LogWarn:  return "WARN";
		case LogError: return "ERROR";
		case LogFatal: return "FATAL";
		case LogMeta: return "LOG";
	}
	return "INFO";
}

LogLevel logLevelToEnum(const char *level)
{
	if (level == NULL)
	{
		return defaultLogLevel;
	}

	if (strcmp(level, "TRACE") == 0) return LogTrace;
	else if (strcmp(level, "DEBUG") == 0) return LogDebug;
	else if (strcmp(level, "INFO" ) == 0) return LogInfo;
	else if (strcmp(level, "WARN" ) == 0) return LogWarn;
	else if (strcmp(level, "ERROR") == 0) return LogError;
	else if (strcmp(level, "FATAL") == 0) return LogFatal;

	return defaultLogLevel;
}

void logMessage(LogLevel level, const char *message)
{
	if (level < currentLogLevel)
	{
		return;
	}
	if (!openLogging()) {
		return;
	}

	if (logFile)
	{
		// Get and format the current time
		time_t now = time(NULL);
		struct tm *localTime = localtime(&now);
		char datetime[100];
		strftime(datetime, sizeof(datetime), "%Y-%m-%d %H:%M:%S", localTime);

		fprintf(logFile, "[%s] %s: %s\n", datetime, logLevelToString(level), message);
		fflush(logFile);
	}
	closeLogging();
}
```

We start with some logging levels. I currently have no use for `TRACE`, but I've seen people recommend it and it doesn't hurt to have extra room. We default to `WARNING` because in the majority of cases, we don't need much logging at all. We could start at `ERROR`, but I think having some warnings in the log might help in the event of a crash, and they're currently not that common. If we're creating a debug build, we'll obviously go to `DEBUG` as a default.

We also add the `META` level, which servers to add logs about logging changes. We always want these to be visible to clarify what's happening when the context changes. This level should not be used outside of this file.

We give ourselves a function to set the logging level and a utility function to set it from a string. We'll also provide some utility functions to convert the log levels to and from regular strings as a convenience.

Finally, we add the log level to the `logMessage` function to check if the level is met and include it in the message, and we check off #1 in our list.

```cpp
void initializeLogging(const char *filename)
{
	delete[] logFileName;
	if (filename == NULL) {
		logFileName = "debug.log";
		logFileNameLength = strlen("debug.log");
	} else {
		logFileNameLength = strlen(filename);
		logFileName = new char[logFileNameLength+1];
		strcpy(logFileName, filename);
	}

	logFile = fopen(logFileName, "w");
	closeLogging();

	logMeta("Initialized logging to %s.", logLevelToString(currentLogLevel));
}
```

Let's give ourselves some more flexibility. We're building several executables from the same code base, so it makes sense to set each one to a different log file. We also want to delete the previous log file so that things don't get confusing, so we open and close the file in write mode.

```cpp
void logFatal(const char *message, ...) {
	if (LogFatal < currentLogLevel)
	{
		return;
	}
	char buffer[256];
	va_list args;
	va_start(args, message);
	vsprintf(buffer, message, args);
	va_end(args);
	logMessage(LogFatal, buffer);
}
```

We add our level logging functions. I've only included one above because the rest are all identical aside from the function name and the log level passed to `logMessage`. Here we regain the flexiblity of `printf` by using [variadic functions][cppref-variadic]. These allow us to pass any arguments had have them converted to a string using `vsprintf`.

```cpp
#ifdef _CHARED
initializeLogging("chared.log");
#else
initializeLogging("winbr.log");
#endif
```

As soon as we can in our entry point (`WINSYS\MACHINE.C` for `WINBR` and `CHARED`, `PCSYS\MACHINE.C` for `NOVA.EXE`) we initialize our logging and set the log file name. This ensures we don't log to the default log filename, and therefore create two log files unnecessarily.

```cpp
if(strcmp(cpBuffer,"[LOG_LEVEL]") == 0)
{
    fileResult = GetNextLine(fp,cpBuffer,sizeof(cpBuffer));
    setLogLevelFromString(cpBuffer);
}
```

Also in `MACHINE.C`, we replace the parsing of `BRSETUP.CFG` that checks for the setting used by RandomLog with our new one, allowing every user to determine their logging level. We start with the default logging level from initialization to this point just in case there's something to log there, then we switch to the logging level in the configuration file.

This sometimes results in log files starting as shown here, but that's not too big of a problem.

```
[2026-01-27 12:11:01] LOG: Initialized logging to WARN.
[2026-01-27 12:11:01] LOG: Changing logging from WARN to TRACE.
```

This finally gives us #1, #4, and #5. We now have a much more useful logging system. In comparison to our previous systems, we're not really losing any functionality or making the performance worse. If the logging level doesn't match, we're only doing the log level comparison.

## How can we improve this further?

As usual, explaining your work to others helps you view it in a different light, so I've already made a few small performance adjustments while writing this article. Still, there remains room for improvement. So, here's what I plan to do next.

Since they're mostly unused or used only for multiplayer, I didn't delve too deeply into the MonoDevice and DEBUG.C/STATUS.C systems. I'm ramping up my work on the multplayer systems anyway, so my first step will be to migrate those messages over to the new logger and get them categorized properly.

### Log performance

The most obvious is adjusting our log levels. when I migrated to the new system, I took everything that didn't have "error," "fatal," or "warning" in the error message and assigned it the `INFO` level. This leads to a noticable hang when closing the advisor screen because it is writing all kinds of information at the start of the turn. Still, even adjusting this down to `DEBUG` or `TRACE` will bring this hang back for anyone trying to track down specific issues.

I think I'll add an option to use buffering with `enableLogBuffer` and `disableLogBuffer`. This will enable or disable buffering and add a check to `openLogging` and `closeLogging`. If buffering is on, those functions will simply short circuit.

Within `enableLogBuffer`, `openLogging` will run before buffering is set to on. Within `disableLogBuffer`, `fflush` will be moved to `closeLogging`, and `closeLogging` will run after buffering is turned off.

We'll stick this into the domain turn initialization and the character avatar loading, as these seem to be some pain points, and they're doing the same thing over and over. If we end up having an issue here, it should be relatively obvious where to look.

Lastly, we add a configuration option to disable buffering via `BRSETUP.CFG` to allow thorough debugging. Flexibilility is key.

### Module labeling

The final improvement is one I'll have to think about for a little while, and that's to include the module name in each error message to make it easier to track down the errors.

When I say module, I mean the section of code responsible for whatever is happening in the application. Character management, the domain turn, adventures, battles, etc. This is a bit difficult to properly implement without adding it either to every log line or adding a label to every file.

One solution is to rewrite the logger as a class and convert the free functions to call a shared logger for the C code. This way each C++ module could initialize a logger. This would require having multiple loggers in memory and require managing a singleton for the file handle. I'm not ready to get into all that, so for now we'll stick with what we have.

## Up next

Up next, we'll begin working on multiplayer. I've already done a bunch of research and will start writing up ideas in the following weeks. I've also been working on resizing the game window, but adventures and battles aren't cooperating with me.

[cppref-variadic]: https://en.cppreference.com/w/c/variadic.html
[kw-defunct]:  {{< ref "2024-05-29-birthright-day-1.md" >}} "Rebuilding Birthright: Misdirection"
[pcgw]: https://www.pcgamingwiki.com