export function findNameById(idToFind: any, people: any, crews: any) {
  // Find the object with the specified _id
  const person = people && people.find((person: any) => person._id.toString() === idToFind);
  const crew = crews && crews.find((crew: any) => crew._id.toString() === idToFind);

  // If person is found, return their name
  if (person && person.name) {
    return person.name;
  } else if (crew && crew.name) {
    // If person is not found, return null or handle accordingly
    return crew.name;
  } else {
    return null;
  }
}

export function findNamesByIds(idToFind: any, people: any, crews: any) {
  // Initialize an empty array to store names
  const names: string[] = [];

  // Iterate over each idToFind
  idToFind.forEach((id: any) => {
    // Find the object with the specified _id
    const person = people && people.find((person: any) => person._id.toString() === id);
    const crew = crews && crews.find((crew: any) => crew._id.toString() === id);

    // If person is found, push their name to the names array
    if (person && person.name) {
      names.push(person.name);
    } else if (crew && crew.name) {
      // If crew is found, push their name to the names array
      names.push(crew.name);
    }
  });

  // Join the names with commas and return as a single string
  return names.join(', ');
}
