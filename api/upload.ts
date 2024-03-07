import  express  from "express"; 
import multer from "multer";
import path from "path";
import { initializeApp } from "firebase/app";
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";

export const router = express.Router(); 

// class FileMiddleware {

//         ///Attribute  filname
//         filename = "";

//          ///Attribute  diskLoader
//          /// Create object of diskLoader for saving file
//         public readonly diskLoader = multer({
//                 ///  storage = define folder (disk) to saved
//           storage: multer.diskStorage({
//                 // destination = saving folder
//             destination: (_req, _file, cb) => {
//               cb(null, path.join(__dirname, "../uploads"));
//             },
//             ///   filename = randome unique name 
//             filename: (req, file, cb) => {
//               const uniqueSuffix =
//                 Date.now() + "-" + Math.round(Math.random() * 10000);
//                 //filename will be unique 
//               this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
//               cb(null, this.filename);
//             },
//           }),
//           // limit file size
//           limits: {
//             fileSize: 67108864, // 64 MByte
//           },
//         });
// }

// //post /upload
// const fileupload = new FileMiddleware();
// router.post("/" ,fileupload.diskLoader.single("file"),(req, res)=>{
//    res.status(200).json({
//         filename: "http://localhost:3000/uploads/" + fileupload.filename 
//    });
// });


/// 1.Connect Firebase
const firebaseConfig = {
        apiKey: "AIzaSyCdcRUj1iK0WyktU_kUxpjGs0gZh73aUJU",
        authDomain: "tripbooking-app-pumitle.firebaseapp.com",
        projectId: "tripbooking-app-pumitle",
        storageBucket: "tripbooking-app-pumitle.appspot.com",
        messagingSenderId: "459643440470",
        appId: "1:459643440470:web:a28b62396af1e3f55c9af7",
        measurementId: "G-7XQWJ6KC67"
      };
      
  initializeApp(firebaseConfig);
  const storage = getStorage();


/// 2. upload file


///Filebase
class FileMiddleware {

        ///Attribute  filname
        filename = "";

         ///Attribute  diskLoader
         /// Create object of diskLoader for saving file
        public readonly diskLoader = multer({
                ///  storage = define folder (disk) to saved
          storage: multer.memoryStorage(),
          // limit file size
          limits: {
            fileSize: 67108864, // 64 MByte
          },
        });
}

//post /upload
const fileupload = new FileMiddleware();
router.post("/" ,fileupload.diskLoader.single("file"),async (req, res)=>{
    /// 2. upload file to firebase Storeg
    //Genarete filename
    const filename =  Date.now() + "-" + Math.round(Math.random() * 10000)+ ".png";
    //define saving filename on fiebase storeg
    const storageRef = ref(storage,"images/"+ filename);
    // define file detail
    const metadata ={
        contentType : req.file!.mimetype
    }
    //upload to firebase stronge
    const resultsnapshot = await uploadBytesResumable(storageRef,req.file!.buffer,metadata);

    const url = await getDownloadURL(resultsnapshot.ref);
   res.status(200).json({
        file : url 
   });
});




//GET /upload
router.get("/" ,(req, res)=>{
        res.send("Method GET in upload.ts");
});