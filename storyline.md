@dhruva
- Fixed frontend build blocks (missing assets, stubbed dependencies)
- Set up local SMTP flow (fixed missing plain-text email templates)
- Connected Pricing Page to the live backend API instead of hardcoded demo data
- Formatted the Pricing Page specifically for Indian Rupees (₹)
- Replaced custom hardcoded SVGs with `lucide-react` icons

--------------------

@akashkhedar
started working on NPL to XML converter using Mistral AI, allowing the project owner to directly write the requirements in natural language and get the XML template generated automatically. For exmaple: "I want to classify text as spam or ham, and also highlight names of people." -> XML template.

--------------------

@akashkhedar
- Fixed the issue where the AI template generator was returning 401 Unauthorized.
- Implemented proper error handling for the AI template generator.
- Added a new endpoint for the AI template generator.
- Updated the API configuration to include the new endpoint.
- Added a new endpoint for the AI template generator.
- Updated the API configuration to include the new endpoint.

--------------------
