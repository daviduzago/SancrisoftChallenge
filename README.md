# Sancrisoft Challenge Mini App

Welcome to the Sancrisoft Challenge Mini App! This app is designed to showcase a video slider component using React Native.

## Getting Started

To get started with the app, follow these instructions:

1. Clone the app repository:

git clone https://github.com/daviduzago/SancrisoftChallenge.git

2. Install the required dependencies using npm:

npm install --legacy-peer-deps

- Note: We use the `--legacy-peer-deps` flag because we use a package for handling SVG URIs, which avoids the need to build a custom SVG component that can accept URLs as inputs.

3. Create a `.env` file in the project root directory with the following variables:

SLIDER_API_TOKEN=Announcements Token
STORY_API_TOKEN=Hero Slider Token

4. To run the project on Android, use the following command:

npx react-native run-android


To run the project on iOS, use the following command:

npx react-native run-ios

## Important Note

Please be aware that the videos used in this app are quite large, approximately 80MB each. This is not recommended for a video slider component as it can affect performance. For better performance, we should consider compressing or streaming these videos on the backend for better app performance. In this app, we have not compressed the videos or stored them on the device to avoid memory and performance issues.

## Questions and Support

If you have any questions or need further assistance, feel free to reach out to reach me. I will be happy to assist you with any inquiries related to the app.

Thank you for your consideration!



