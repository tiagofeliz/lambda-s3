# Aws Lambda-S3 sync

The main objective of this project is to be used in a listener on S3 folder/bucket, and to synchronize files between folders.

However, any interaction with the file can be included in the `waterfall` of the `src/Lambda.js` file.

Project structure:
```
src
 |_ Auth.js
 |_ Lambda.js
 |_ Logger.js
 |_ SSMManager.js
index.js
```

## SSMManager.js

For recovery of any credential or any other value/parameter necessary for the execution of the project.

## Auth.js

Recovery of any tokens necessary for interactions with files.

## Lambda.js

This is where we handle the files received in the folder defined as `trigger`, where any interaction with the files can be done until it can be sent to the folder defined as` target`.

If the file does not need to be moved to the `target` folder, just remove this step from` waterfall`.