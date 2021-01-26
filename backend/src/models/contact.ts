export default class Contact {
  id: string;
  username: string;
  location: string;
  
  constructor(id: string, username: string, location: string) {
    this.id = id;
    this.username = username;
    this.location = location;
  }
}
