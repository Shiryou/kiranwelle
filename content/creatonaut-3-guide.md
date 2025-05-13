---
title: "Creating a language course with Creatonaut 3"
description: "A basic guide for using Lingonaut's Creatonaut 3 to create language courses."
url: /lingonaut/creatonaut-3-guide
type: page
show_toc: true
comments: true
date: 2025-05-13
categories: [Lingonaut]
---
<style>
table {
    margin: auto;
}
table, th, td {
    border: 1px solid silver;
}
th, td {
    padding: 0px 5px;
}

.reference-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.reference-table {
    margin: 10px;
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
}
.reference-table table {
    width: 300px;
}
.reference-table h3 {
    text-align: center;
}
</style>
<article>

This page is a reference guide and basic tutorial for using [Lingonaut][lingonaut]'s [Creatonaut 3][creatonaut]. It will cover the basics of how to get started and create a basic course. After that, it will break down the available options and how to use them.

<div id="toc"></div>

## What is Creatonaut 3?

Creatonaut 3 is the course creation tool that Lingonaut uses to build new language courses to use in the app. The tool is available to anyone who wants to use it, and it stores it's data locally within the browser. This has two consequences:

1. **Privacy:** Only you have access to the course you're creating. This gives you the freedom to experiment and break things as you learn without concern for it being seen or causing issues for other Lingonaut or Creatonaut users.
2. **Data retention:** If your browser clears your local storage, all your hard work is gone. No second chances. **Export your course often!** Some browsers may clear local storage when your computer or tablet is low on batteries.

## Important note

Creatonaut is very new. It is likely to change often and contain bugs. Safe often.

There is currently a bug that will empty your session as soon as you click "Open Project." Be very careful when using the File menu to Export your project that you don't accidentally click this button or you will lose your data. This issue has been reported to the developer.

## Creating your first course

![image](/img/posts/lingonaut/welcome-to-creatonaut.png)

Now that you understand what Creatonaut is, let's jump into creating your first course. Go to the Creatonaut 3 website at https://creatonaut.lingonaut.app/

You'll be asked to enter your name or nickname. This is used to keep track of who is making changes to your course(s) and to give you credit. It is suggested to set this to your Lingonaut username.

Once you've entered your name, you can create a new course by clicking the "New Project" button and giving your project a name. Creatonaut will create a basic course layout for you as shown below. Let's go over each of the panels in order.

## Creatonaut layout

### Project Files Panel

![image](/img/posts/lingonaut/course-overview.png)

The Project Files panel gives you an overview of the files that are part of your course. This will include the basic metadata (it's name, who created it, it's version, etc.), the unit definition files, your vocabulary and sentences lists, and any audio files you create.

For most of the time as you create a new course, you won't need to pay much attention to this panel as everything within it will be created and modified using the other panels.

When you export your course using *File* &rarr; *Export Project (.cn3)*, Creatonaut will create a zip archive containing all of the files listed in the Project Files panel.

&nbsp;

### Unit and Lesson Panels

![image](/img/posts/lingonaut/create-a-unit.png)

The second panel is the Units Panel. This lists all of your units, along with each unit's skills and the skills' unique IDs. You can also create new units and skills or delete existing ones by right-clicking on this list, as shown above.

The third panel is the Lessons Panel. This lists all of a skill's lessons, along with the questions associated to them and the questions' unique IDs. As with the Units and Skill, you can create and delete lessons and questions by right-clicking.

To review, a course's hierarchy is: *Unit* &rarr; *Skill* &rarr; *Lesson* &rarr; *Question*

*Note: For the most part you can ignore the ID numbers shown as they should never be very relevant to creating your course. They are an important part of protecting against naming conflicts within your course. If you have two units named "Basics," Lingonaut will be able to distinguish between them by using their IDs internally. While it's generally best to avoid naming multiple units the same, this gives you the flexibility to replace units without worrying about conflicts.*

&nbsp;

### Editing Panel

The fourth panel, on the far right, is your editing panel. This allows you to make changes to whatever item you currently have selected, whether it be the Course Overview, a unit, or a question.

## Course Overview

![image](/img/posts/lingonaut/course-overview.png)

The course overview contains the metadata that allows Lingonaut to understand what your course is about, which language it is associated with, who created it, and what the verison number is. Let's go over these fields in detail:

* **Language:** The language that this course covers.
* **Attribution:** Who contributed to this course. This should generally include anyone editing the course in Creatonaut, voice actors, translators, etc.
* **Units:** The number of units contained in the course.
* **Version:** The version number. This helps Lingonaut keep track of which courses have been updated and which copy of the course is the latest.
* **Visible Name:** The name for the course that people will see in Lingonaut.

## Unit overview

![image](/img/posts/lingonaut/unit-overview.png)

Clicking on a unit in the units panel will display the Unit Overview.



</article>

[lingonaut]: https://lingonaut.app
[creatonaut]: https://creatonaut.lingonaut.app/