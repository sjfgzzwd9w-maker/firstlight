#!/bin/bash
input=$(cat)
file=$(echo "$input" | jq -r '(.tool_input.file_path // .tool_input.notebook_path // empty)')
cwd=$(echo "$input" | jq -r '.cwd')

if [ -n "$file" ]; then
  project=$(basename "$cwd")
  ~/.wakatime/wakatime-cli --entity "$file" --plugin "claude-code/1.0.0" --category "ai coding" --write --project "$project" > /dev/null 2>&1
fi
