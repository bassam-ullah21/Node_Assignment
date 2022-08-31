// import { HomePage } from "./app.js";
import { objOfHomePage } from "./app.js";
import { ICrud } from "./Icrud.js";
import { Role, User } from "./user.js";

const Url: string = "http://localhost:5000";

export class UserService implements ICrud<User> {
  users: User[] = [];
  constructor() {
    this.loadData();
  }

  async loadData() {
    let serverUsersData: any[];
    await fetch(Url)
      .then((Response) => Response.json())
      .then((data) => (serverUsersData = data));

    console.log("From Server side ", Object.values(serverUsersData)[0]);

    let usersData: any[];

    usersData = Object.values(serverUsersData)[0];
    // await fetch("../data.json")
    //   .then((Response) => Response.json())
    //   .then((data) => (usersData = data));

    // console.log("From Client Side", usersData);

    usersData.forEach((user) => {
      this.users.push(new User(user));
    });
  }
  edit(event: any): void {
    let tr = event.target.parentElement.parentElement as HTMLTableRowElement;
    tr.contentEditable = "true";

    (event.target as HTMLButtonElement).parentElement.contentEditable = "false";

    event.target.parentElement.children[0].style.display = "none";
    event.target.parentElement.children[1].style.display = "none";
    event.target.parentElement.children[2].style.display = "flex";
    event.target.parentElement.children[3].style.display = "flex";
  }

  create(item: User): void {
    this.users.push(item);
    objOfHomePage.render();
  }
  read(): User[] {
    return this.users;
  }

  update(event: any, item: User): void {
    event.target.parentElement.parentElement.contentEditable = "false";
    let tr = event.target.parentElement.parentElement as HTMLTableRowElement;
    item.firstName = tr.children[0].innerHTML;
    item.middleName = tr.children[1].innerHTML;
    item.lastName = tr.children[2].innerHTML;
    item.email = tr.children[3].innerHTML;
    item.phone = tr.children[4].innerHTML;
    item.role =
      tr.children[5].innerHTML === "Super Admin"
        ? Role.SUPERADMIN
        : tr.children[5].innerHTML === "Admin"
        ? Role.ADMIN
        : Role.SUBSCRIBER;
    item.address = tr.children[6].innerHTML;

    event.target.style.display = "none";
    event.target.parentElement.children[3].style.display = "none";
    event.target.parentElement.children[0].style.display = "flex";
    event.target.parentElement.children[1].style.display = "flex";
  }

  // testCalling() {
  //   console.log("Test Calling");
  // }

  delete(item: User): void {
    deleteUser(item.id.toString())
      .then((deleteApiResponse) => {
        console.log(deleteApiResponse.users);

        this.users = deleteApiResponse.users;
        objOfHomePage.render();
        // this.testCalling();
      })
      .catch(() => {
        alert("Error Occured");
      });

    // this.users.splice(this.users.indexOf(item), 1);
    // objOfHomePage.render();
  }

  // delete(item: User[]): void {
  //   this.users = item;
  //   console.log(this.users);

  //   objOfHomePage.render();
  //   // console.log(item);
  // }
}

async function deleteUser(id: string) {
  let response = await fetch(Url + "/" + id, {
    method: "DELETE",
  });
  let deleteApiResponse = await response.json();
  return deleteApiResponse;
}
