from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForMaskedLM
import torch
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize model and tokenizer
logger.info("Loading KazakhBERTmulti model and tokenizer...")
tokenizer = AutoTokenizer.from_pretrained("amandyk/KazakhBERTmulti")
model = AutoModelForMaskedLM.from_pretrained("amandyk/KazakhBERTmulti")
model.eval()  # Set model to evaluation mode
logger.info("Model and tokenizer loaded successfully!")

def check_grammar(text):
    """
    Check grammar in the given Kazakh text using the KazakhBERTmulti model.
    This is a simplified implementation that you can enhance based on your specific needs.
    """
    try:
        # Tokenize the input text
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Get model predictions
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Get the predicted tokens
        predicted_tokens = torch.argmax(outputs.logits, dim=-1)
        
        # Convert tokens back to text
        predicted_text = tokenizer.decode(predicted_tokens[0], skip_special_tokens=True)
        
        # Compare original and predicted text to find potential errors
        corrections = []
        original_tokens = tokenizer.tokenize(text)
        predicted_tokens = tokenizer.tokenize(predicted_text)
        
        # Simple comparison to find differences
        for i, (orig, pred) in enumerate(zip(original_tokens, predicted_tokens)):
            if orig != pred:
                start_pos = text.find(orig)
                if start_pos != -1:
                    corrections.append({
                        "start": start_pos,
                        "end": start_pos + len(orig),
                        "original": orig,
                        "suggestion": pred
                    })
        
        return {
            "original_text": text,
            "corrections": corrections,
            "message": "Grammar check completed successfully"
        }
    
    except Exception as e:
        logger.error(f"Error in grammar check: {str(e)}")
        return {
            "error": f"Error processing text: {str(e)}",
            "original_text": text,
            "corrections": []
        }

@app.route('/check-grammar', methods=['POST'])
def grammar_check():
    try:
        data = request.get_json()
        logger.info("Received request data: %s", data)
        
        if not data or 'text' not in data:
            logger.error("No text provided in request")
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        if not text.strip():
            logger.error("Empty text provided")
            return jsonify({"error": "Empty text provided"}), 400
        
        logger.info(f"Processing text for grammar check: {text[:100]}...")
        results = check_grammar(text)
        logger.info(f"Grammar check results: {results}")
        return jsonify(results)
    
    except Exception as e:
        logger.error(f"Error in endpoint: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True) 