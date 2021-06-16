const person = {
  name: 'AntiDigest',
  website: 'https://digitalinspiration.com/',
  email: 'amit@AntiDigest.org',
};

const { name, email, country = 'unknown' } = person;
Logger.log(`${name}'s email address is ${email}. Their country is ${country}`);

export default person;
