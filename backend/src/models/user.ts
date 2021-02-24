import { UserInterface } from "./../types/index";
import { getUserdata, persistUserdata } from "../service/dataService";
import { config } from "../config/config";
export default class User implements UserInterface {
  status: string;
  image: string;
  id: string;
  lastSeen: number;

  constructor() {
    try {
      const userData = getUserdata();
      this.status = userData.status;
      this.image = userData.image;
      this.id = userData.id
      this.lastSeen = userData.lastSeen
    } catch (error) {
      this.status = "Exploring the new DigitalTwin";
      this.image = `https://${config.appId}/api/user/avatar/default`;
      this.id = config.userid;
      persistUserdata({
        status: this.status,
        image: this.image,
        id: this.id,
        lastSeen: this.lastSeen
      });
    }
  }

  getStatus() {
    return this.status;
  }
  getAvatar() {
    return this.image;
  }
  getData() {
    return {
      status: this.status,
    };
  }

  getLastSeen() {
    return this.lastSeen;
  }

  updateStatus(newStatus: string) {
    this.status = newStatus;
    persistUserdata({
      status: this.status,
      image: this.image,
      id: this.id,
      lastSeen: this.lastSeen
    });
  }

  updateLastSeen() {
    this.lastSeen = new Date().getTime()
    persistUserdata({
      status: this.status,
      image: this.image,
      id: this.id,
      lastSeen: this.lastSeen,
    });
  }

  updateAvatar(url: string) {
    this.image = url;
    persistUserdata({
      status: this.status,
      image: this.image,
      id: this.id,
      lastSeen: this.lastSeen
    });
  }
}
