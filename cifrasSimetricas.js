function cesar(text, shift) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
  
    if (not(text.length > 0)) {
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

x =  cesar("quiabo", 3)

console.log(x)