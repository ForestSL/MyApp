package server.mysqlvps;

import java.io.*;
import java.net.*;
import java.util.*;

import jsonparser.parserjson;

/**
 * Created by stdzysta on 2016/12/17.
 */
public class MultiThreadServer {
    ArrayList<String> usersOnline = new ArrayList<String>();

    public static void main(String[] args) {
        new MultiThreadServer();
    }

    public MultiThreadServer() {

        checkOnlineOrNot checkOnlineTask = new checkOnlineOrNot();
        new Thread(checkOnlineTask).start();

        try {
            ServerSocket serverSocket = new ServerSocket(8000);
            System.out.println("Server started at" + new Date() + '\n');
            int clientNo = 1;
            while (true) {
                Socket socket = serverSocket.accept();
                System.out.print("Starting thread for client" + clientNo +
                        "at" + new Date() + "\n");
                //socket.getRemoteSocketAddress();
                InetAddress inetAddress = socket.getInetAddress();
                System.out.print("Client" + clientNo + "'s host name is " +
                        inetAddress.getHostName() + "\n");
                System.out.print("Client" + clientNo + "'s IP Address is"
                        + socket.getRemoteSocketAddress() + "\n");

                HandleAClient task = new HandleAClient(socket);
                new Thread(task).start();
                clientNo++;
            }
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }

    class checkOnlineOrNot implements Runnable {
        /**
         * every time every oprate will remove all user to onlineList
         * every
         */

        public void run() {
            while (true) {
                try {
                    Thread.sleep(60000);
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                usersOnline.clear();
            }
        }
    }


    class HandleAClient implements Runnable {
        private Socket socket;

        public HandleAClient(Socket socket) {
            this.socket = socket;
        }

        public void run() {
            try {
                ObjectInputStream inputFromClient = new ObjectInputStream(
                        socket.getInputStream());
                ObjectOutputStream outputToClient = new ObjectOutputStream(
                        socket.getOutputStream());
                while (true) {
                    UserSet getfromClient = (UserSet) inputFromClient.readObject();

                    switch (getfromClient.getServiceType()) {
                        /**
                         * 0  register return error code
                         */
                        case 0: {
                            String userLogin = getfromClient.getUser_login();
                            String userPasswd = getfromClient.getUser_passwd();
                            int errorCode = MySQLConnect.sigUpNewUser(userLogin, userPasswd);
                            switch (errorCode) {
                                case 0:
                                    System.out.println("User Regist Success:" + getfromClient.getUser_login() + '\n');
                                    break;
                                case 1:
                                    System.out.println("User_login name already exist:" + getfromClient.getUser_login() + '\n');
                                    break;
                                case 2:
                                    System.out.println("Invalid Username Please Retry:" + getfromClient.getUser_login() + '\n');
                                    break;
                                default:
                                    System.out.println("default nothing ");
                                    break;
                            }

                            UserSet returnSet = new UserSet(0, errorCode);
                            outputToClient.writeObject(returnSet);
                        }
                        break;
                        /**
                         *  login return error code
                         */
                        case 1: {
                            String userLogin = getfromClient.getUser_login();
                            String userPasswd = getfromClient.getUser_passwd();
                            int errorCode = MySQLConnect.loginOldUser(userLogin, userPasswd);
                            switch (errorCode) {
                                case 0:
                                    System.out.println("User Login Success:" + getfromClient.getUser_login() + '\n');
                                    break;
                                case 1:
                                    System.out.println("User_login Wrong Password:" + getfromClient.getUser_login() + '\n');
                                    break;
                                case 2:
                                    System.out.println("User_login name not exist:" + getfromClient.getUser_login() + '\n');
                                    break;
                                default:
                                    System.out.println("default nothing ");
                                    break;
                            }
                            UserSet returnSet = new UserSet(1, errorCode);
                            outputToClient.writeObject(returnSet);
                        }
                        break;
                        /**
                         * No using function  it is preset And no used after
                         */
                        case 2: {
                            //every 15s
                            boolean userOnlineExist = false;
                            String userLoginOnline = getfromClient.getWord();
                            for (int i = 0; i < usersOnline.size(); i++) {
                                if (userLoginOnline.equals(usersOnline.get(i))) {
                                    userOnlineExist = true;
                                    break;
                                }
                            }
                            if (!userOnlineExist) {
                                usersOnline.add(userLoginOnline);
                            }
                        }
                        break;
                        /**
                         * Search Word
                         */
                        case 3: {
                            String word = getfromClient.getWord();
                            UserSet returnSet = new UserSet(parserjson.YouDaoTranslate(word),
                                    parserjson.BingTranslate(word),
                                    parserjson.JinShanTranslate(word));
                            outputToClient.writeObject(returnSet);
                        }
                        break;
                        /**
                         * User favor one company's word translation
                         */
                        case 4: {
                            MySQLAffection.UserAffectionSend(getfromClient.getUser_login(),
                                    getfromClient.getWord(), getfromClient.getFavorCompany());
                        }
                        break;
                        /**
                         *Return favor Count
                         */
                        case 5: {
                            int[] favorCount = MySQLAffection.ReturnFavor(getfromClient.getWord());
                            UserSet returnSet = new UserSet(favorCount);
                            outputToClient.writeObject(returnSet);
                        }
                        break;
                        /**
                         *See All people and people online
                         *
                         */
                        case 6: {
                            String allUsers = MySQLConnect.returnUserlist();
                            String UsersOnline = "";
                            for (int i = 0; i < usersOnline.size(); i++) {
                                UsersOnline += usersOnline.get(i) + "\n";
                            }
                            UserSet returnSet = new UserSet(allUsers, UsersOnline);
                            outputToClient.writeObject(returnSet);
                        }
                        break;
                        /**
                         *Send WordCard
                         * refresh state
                         */
                        case 7: {
                            if (getfromClient.getUser_send().equals("all")) {
                                String allUser = MySQLConnect.returnAllUser();

                                String[] userlistAll = allUser.split(",");
                                for (int i = 0; i < userlistAll.length; i++)
                                    MySQLConnect.sendWord(getfromClient.getUser_login(),
                                            userlistAll[i], getfromClient.getWord());
                            } else
                                MySQLConnect.sendWord(getfromClient.getUser_login(),
                                        getfromClient.getUser_send(), getfromClient.getWord());

                            //发送的同时刷新一下动态吧
                        }

                        case 8: {
                            String user_Login = getfromClient.getWord();
                            String messageGet = MySQLConnect.returnWordCardList(user_Login);
                            UserSet returnSet = new UserSet(messageGet);
                            outputToClient.writeObject(returnSet);
                        }
                        default: {
                        }
                        break;

                    }

                }
            } catch (IOException e) {
                System.err.println(e);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }
}

/**
 * Client call function
 * 0
 * <p>
 * * errorcode
 * sign up
 * 0:success
 * 1:userlogin exist
 * 2:invalid username or length out of range
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String loginuse = "test123411111111eee";
 * String loginpasswd = "test";
 * UserSet s = new UserSet(0,loginuse, loginpasswd);
 * toServer.writeObject(s);
 * //  toServer.writeDouble(radius);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * 1
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String loginuse = "test123411111111eee";
 * String loginpasswd = "test";
 * UserSet s = new UserSet(1,loginuse, loginpasswd);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * 2
 * <p>
 * class checkOnlineOrNot implements Runnable{
 * public void run(){
 * try{
 * Thread.sleep(15000);}
 * catch (InterruptedException ex){
 * ex.printStackTrace();
 * }
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String loginuse = "test";
 * UserSet s = new UserSet(2,loginuse);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * }
 * }
 * <p>
 * <p>
 * <p>
 * 3
 * <p>
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * UserSet s = new UserSet(5);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * int []favorCount=t.getFavorCount();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String word = "test";
 * UserSet s = new UserSet(3,word);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * String Youdao=t.getYouDaoTranslation();
 * String JinShan=t.getJinshanTranslation();
 * String Bing=t.getBingTranslation();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * 4
 * 用户点赞单词没有返hui
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String word = "fantasy";
 * String user_login="test";
 * int favorCompany=1;
 * UserSet s = new UserSet(4,user_login,word,favorCompany);
 * toServer.writeObject(s);
 * toServer.flush();
 * <p>
 * <p>
 * <p>
 * 5
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * UserSet s = new UserSet(5);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * int []favorCount=t.getFavorCount();
 * System.out.println(t.getServiceType() + "\t" + t.getErrorcode());
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * <p>
 * 6
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * UserSet s = new UserSet(6);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * String all_User=t.getAll_User();
 * String user_Online=t.getUser_Online();
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * <p>
 * <p>
 * 7
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String userSend;
 * String word;
 * String userReceive
 * UserSet s = new UserSet(7,word,userSend,userReceive);
 * toServer.writeObject(s);
 * toServer.flush();
 * <p>
 * <p>
 * 8
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String user_Login;
 * UserSet s = new UserSet(8,user_Login);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * String wordCardList=t.getGetWordCard();
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * <p>
 * <p>
 * 如果消息函数自动刷新  那就client有个线程不断获取就行；
 * <p>
 * class checkMessage implements Runnable{
 * <p>
 * public void run(){
 * try{
 * Thread.sleep(10000);}
 * catch (InterruptedException ex){
 * ex.printStackTrace();
 * }
 * toServer = new ObjectOutputStream(socket.getOutputStream());
 * String user_Login;
 * UserSet s = new UserSet(8,user_Login);
 * toServer.writeObject(s);
 * toServer.flush();
 * fromServer = new ObjectInputStream(socket.getInputStream());
 * try {
 * UserSet t = (UserSet) fromServer.readObject();
 * String wordCardList=t.getGetWordCard();
 * } catch (ClassNotFoundException ex) {
 * ex.printStackTrace();
 * }
 * }
 * <p>
 * define ServiceType
 * 0  注册
 * 1  登录
 * 2  返回值确定注册和登录的errorcode
 * 3  查询
 * 4  用户点赞单词
 * 5  每隔2s返回目前某单词的三个翻译的排行
 * 6  查看所有人员 以及在线离线状况
 * 7  发送单词卡
 * 8  查看动态 发送单词卡的
 * <p>
 * errorcode
 * sign up
 * 0:success
 * 1:userlogin exist
 * 2:invalid username or length out of range
 * <p>
 * log in
 * define 0:login success
 * 1:wrong passwd
 * 2:User didn't exist
 * <p>
 * //Define Company
 * YouDao 1
 * Bing 2
 * JinShan 3
 */


/**
 * 如果消息函数自动刷新  那就client有个线程不断获取就行；

 class checkMessage implements Runnable{

 public void run(){
 try{
 Thread.sleep(10000);}
 catch (InterruptedException ex){
 ex.printStackTrace();
 }
 toServer = new ObjectOutputStream(socket.getOutputStream());
 String user_Login;
 UserSet s = new UserSet(8,user_Login);
 toServer.writeObject(s);
 toServer.flush();
 fromServer = new ObjectInputStream(socket.getInputStream());
 try {
 UserSet t = (UserSet) fromServer.readObject();
 String wordCardList=t.getGetWordCard();
 } catch (ClassNotFoundException ex) {
 ex.printStackTrace();
 }
 }
 */


/**
 * define ServiceType
 * 0  注册
 * 1  登录
 * 2  返回值确定注册和登录的errorcode
 * 3  查询
 * 4  用户点赞单词
 * 5  每隔2s返回目前某单词的三个翻译的排行
 * 6  查看所有人员 以及在线离线状况
 * 7  发送单词卡
 * 8  查看动态 发送单词卡的
 */

/**
 * errorcode
 * sign up
 * 0:success
 * 1:userlogin exist
 * 2:invalid username or length out of range
 *
 * log in
 * define 0:login success
 * 1:wrong passwd
 * 2:User didn't exist
 *
 * //Define Company
 * YouDao 1
 * Bing 2
 * JinShan 3
 */