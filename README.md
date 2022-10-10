# deadline-notify
GitHub Actionsを用いて各課題の期日をDiscord Webhookでお知らせ

## Setup
GitHub ActionのSecretsで以下を設定してください

|||
|---|---|
|BB_ICS_URL|BBから吐き出されるicsのリンク|
|DISCORD_WEBHOOK_URL|送信先Discord Webhookのリンク|
|BB_ICON_URL|BBのアイコン|
|MENTIONID|メンション先．`<@&xxx>`のような形式で指定可能です|