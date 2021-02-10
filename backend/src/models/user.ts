import { UserInterface } from "./../types/index";
import { getUserdata, persistUserdata } from "../service/dataService";
import { config } from "../config/config";
export default class User implements UserInterface {
  status: string;
  image: string;
  id: string;

  constructor() {
    try {
      const userData = getUserdata();
      this.status = userData.status;
      this.image = userData.image;
      this.id = userData.id
    } catch (error) {
      this.status = "Exploring the new DigitalTwin";
      this.image = `https://${config.appId}/api/user/avatar`;
      this.id = config.userid;
      persistUserdata({
        status: this.status,
        image: this.image,
        id: this.id,
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

  updateStatus(newStatus: string) {
    this.status = newStatus;
    persistUserdata({
      status: this.status,
      image: this.image,
      id: this.id,
    });
  }

  updateAvatar(url: string) {
    this.image = url;
    persistUserdata({
      status: this.status,
      image: this.image,
      id: this.id,
    });
  }
}
