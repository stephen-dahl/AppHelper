import { ConnectionInterface, LoginUserChurchInterface, SocketActionHandlerInterface, SocketPayloadInterface, UserChurchInterface } from "../interfaces";
import { ApiHelper } from "./ApiHelper";
import { ArrayHelper } from "./ArrayHelper";
import { CommonEnvironmentHelper } from "./CommonEnvironmentHelper";

export class SocketHelper {
  static socket: WebSocket;
  static socketId: string;
  static actionHandlers: SocketActionHandlerInterface[] = [];
  private static userIdChurchId: {userId:string, churchId:string} = {userId:"", churchId:""};

  static setUserChurch = (uc: {userId:string, churchId:string}) => {
    if (uc?.churchId && uc.userId && uc.churchId!==this.userIdChurchId.churchId && uc.userId!==this.userIdChurchId.userId) {
      this.userIdChurchId = uc;
      this.createAlertConnection();
    }
  }

  static createAlertConnection = () => {
    if (SocketHelper.userIdChurchId.userId) {
      const connection: ConnectionInterface = { conversationId: "alerts", churchId: SocketHelper.userIdChurchId.churchId, displayName: "Test", socketId: SocketHelper.socketId, userId:SocketHelper.userIdChurchId.userId }
      ApiHelper.postAnonymous("/connections", [connection], "MessagingApi");
    }
  }

  static init = async () => {
    if (SocketHelper.socket !== undefined && SocketHelper.socket.readyState !== SocketHelper.socket.OPEN) {
      try { SocketHelper.socket.close(); } catch (e) { console.log(e); }
    }

    await new Promise((resolve) => {
      SocketHelper.socket = new WebSocket(CommonEnvironmentHelper.MessagingApiSocket);
      SocketHelper.socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        SocketHelper.handleMessage(payload);
      };
      SocketHelper.socket.onopen = async (e) => {
        SocketHelper.socket.send("getId");  //not sure this is needed.  It auto-sends socketId on connect
        setTimeout(() => { resolve(null); }, 500);
      };
      SocketHelper.socket.onclose = async (e) => {
        //SocketHelper.events.disconnectHandler();
        setTimeout(() => {
          //Silently reconnect
          if (SocketHelper.socket.readyState === SocketHelper.socket.CLOSED) {
            SocketHelper.init().then(() => {
              SocketHelper.createAlertConnection();
              SocketHelper.handleMessage({ action: "reconnect", data: null })
            });
          }
        }, 1000);

        //SocketHelper.handleMessage({ action: "disconnect", data: null })
      }
    });
  }

  static addHandler = (action: string, id: string, handleMessage: (data: any) => void) => {
    const existing = ArrayHelper.getOne(SocketHelper.actionHandlers, "id", id);
    if (existing !== null) existing.handleMessage = handleMessage;
    else SocketHelper.actionHandlers.push({ action, id, handleMessage });
  }

  static handleMessage = (payload: SocketPayloadInterface) => {
    //console.log("MESSAGE", payload)
    if (payload.action==="socketId") {
      SocketHelper.socketId = payload.data;
    }
    else {
      ArrayHelper.getAll(SocketHelper.actionHandlers, "action", payload.action).forEach((handler) => {
        handler.handleMessage(payload.data);
      });
    }
  }

}
