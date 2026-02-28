import os
import logging
from mistralai import Mistral

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert system designed to generate valid XML configuration templates for the Cynaps (Label Studio) data annotation platform.
The user will provide a natural language description of their labeling task.
Your ONLY output must be the raw, valid XML configuration code. Do not include markdown formatting like ```xml or any explanations.

Rules for Cynaps XML configuration:
1. The root element must always be <View>.
2. Data objects are displayed using object tags like <Text name="text" value="$text"/>, <Image name="image" value="$image"/>, <Audio name="audio" value="$audio"/>, etc. The `value` attribute must start with a $ to reference a variable in the imported data.
3. Control tags handle the annotation logic. Examples include <Choices>, <Labels>, <Rating>, <TextArea>, etc.
4. When classifying the entire data object (like sentiment analysis), use <Choices>. It must have `name` and `toName` attributes. Inside it, use <Choice value="x"/> tags. Example:
   <Choices name="sentiment" toName="text">
     <Choice value="Positive"/>
     <Choice value="Negative"/>
   </Choices>
5. When annotating specific parts of the data (like Named Entity Recognition or Bounding Boxes), use <Labels>. It must have `name` and `toName` attributes. Inside it, use <Label value="x" background="color"/> tags. Example:
   <Labels name="ner" toName="text">
     <Label value="Person" background="red"/>
     <Label value="Organization" background="blue"/>
   </Labels>
6. Make sure the `toName` attribute of a control tag matches the `name` attribute of the object tag it is targeting. For example, if you have <Text name="my_text" value="$text"/>, the <Choices> tag must have `toName="my_text"`.

Example Input: "I want to classify text as spam or ham, and also highlight names of people."
Example Output:
<View>
  <Text name="text" value="$text"/>
  <Choices name="classification" toName="text">
    <Choice value="Spam"/>
    <Choice value="Ham"/>
  </Choices>
  <Labels name="ner" toName="text">
    <Label value="Person" background="#FFA39E"/>
  </Labels>
</View>

Based on the user's description, generate the complete and valid XML."""

def get_mistral_client():
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        logger.warning("MISTRAL_API_KEY environment variable is not set. API calls will fail.")
        return None
    return Mistral(api_key=api_key)

def generate_xml_template(prompt: str) -> str:
    """
    Generates a Cynaps XML label config based on a natural language prompt.
    """
    client = get_mistral_client()
    if not client:
        raise ValueError("Mistral API key not configured.")

    try:
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1 # Low temperature for more deterministic/structured output
        )
        
        # Clean up the output in case the model wraps it in markdown blocks
        xml_content = response.choices[0].message.content.strip()
        if xml_content.startswith("```xml"):
            xml_content = xml_content[6:]
        if xml_content.startswith("```"):
            xml_content = xml_content[3:]
        if xml_content.endswith("```"):
            xml_content = xml_content[:-3]
            
        return xml_content.strip()

    except Exception as e:
        logger.error(f"Error calling Mistral API: {str(e)}")
        raise e
