
const capitalize = (string) => {
  console.log("string from capitalize", string);
  string = string.split(' ');
  capitalized = string.map((word, index) => {
    if(string.length === 1 || word.length > 4 || index === 0) {
      word = word.split('');
      word[0] = word[0].toUpperCase();
      word = word.join('');

    }
    return word;
  })

  return capitalized.join(' ');
}

module.exports = { capitalize };
