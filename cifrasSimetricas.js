const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function cesar(text, shift) {
    let result = '';
  
    if (!(text.length > 0)) {
        throw(e)
    }
    
    if (shift % shift != 0) {
        throw(e)
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const index = alphabet.indexOf(char.toLowerCase());
  
      if (index !== -1) {
        const newIndex = (index + shift) % alphabet.length;
        result += alphabet[newIndex];
      } else {
        result += char;
      }
    }
  
    return result;
  };

// x =  cesar("quiabo", 26)

// console.log(x)
