import  express, { query }  from "express"; 
import  { conn, queryAsync }from "../dbconnect";
import mysql from "mysql";
import { TripGetRequest } from "./model/trip_post";
import e from "express";
export const router = express.Router(); 

// /trip 
// Get all trips from database
router.get("/" ,(req, res)=>{
    if(req.query.id){
        const id = req.query.id;
        const name = req.query.name;
        res.send(`Show id ${id} ${name}`);
    }else{
      const sql = "select * from trip";
      conn.query(sql,(err,result)=> {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
      });
    }
       
});


// /trip/id
// / Get id from database
router.get("/:id" ,(req, res)=>{
    const id = req.params.id;
    //bad code
    // const sql =  `select * from trip where idx  = ${id}`;
    
    //Good code
    const sql =  `select * from trip where idx  = ?`;
    conn.query(sql,[id],(err,result)=> {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
      });
});

// /trip Post
// router.post("/",(req,res)=>{
//      const body = req.body;
//      res.status(201).json(body);
//      res.send(`Method Post in trip.ts with ${JSON.stringify(body)}`); 
// });


///  /trip/search/fields?id=3
///  /trip/search/fields?name=ฟูจิ
router.get("/search/fields",(req, res)=>{
    const id = req.query.id;
    const name = req.query.name;

    const sql = "select * from trip where" + "(idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)";
    conn.query(sql , [id,"%"+name+ "%"], (err,result)=>{
        res.json(result);
    });
});


router.get("/search/price",(req, res)=>{
    const price = req.query.price;
    const sql = "select * from trip where price and price <= ?";
    conn.query(sql , [price], (err,result)=>{
        res.json(result);
    });
});



///POST trip
///Insert data
router.post("/",(req,res)=>{

    const trip : TripGetRequest = req.body;
   let sql = "INSERT INTO `trip`(`name`, `country`, `destinationid`, `coverimage`, `detail`, `price`, `duration`) VALUES (?,?,?,?,?,?,?)";

    sql = mysql.format(sql,[
        trip.name,
        trip.country,
        trip.destinationid,
        trip.coverimage,
        trip.detail,
        trip.price,
        trip.duration

    ]);
    conn.query(sql,(err,result)=>{
        if(err) throw err;{
            res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        }
        });
    
});

///delete /trip/1111
router.delete('/:id',(req,res)=>{
    const id = +req.params.id;
    let sql = "delete from trip where idx = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;{
            res.status(200).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        }
    });
});


///PUT /trip/1111
// router.put('/:id',(req,res)=>{
//     const id = +req.params.id;
//     const trip : TripGetRequest= req.body;

//     let sql = "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
//     sql = mysql.format(sql , [
//         trip.name,
//         trip.country,
//         trip.destinationid,
//         trip.coverimage,
//         trip.detail,
//         trip.price,
//         trip.duration,
//         id
//     ]);
//     conn.query(sql,(err,result)=>{
//         if (err) throw err;
//         res.status(201).json({ affected_row: result.affectedRows });
//     });
  
// });



///PUT /trip/1111
router.put("/:id", async(req,res)=>{
    ///Receive data
    const id = +req.params.id;
    const trip : TripGetRequest = req.body;

    // Get original data from table by id

    let sql ='select * from trip where idx= ?';
    sql = mysql.format(sql,[id]);

    // Query and Eait for result
   const result = await queryAsync(sql);
   const jsonStr = JSON.stringify(result);
   const jsonObj= JSON.parse(jsonStr);
   const tripOriginal : TripGetRequest =jsonObj[0];

   // Merge new data yo original
   const updateTrip = {...tripOriginal, ...trip};

   //update
   sql = "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
      sql = mysql.format(sql , [
        updateTrip.name,
        updateTrip.country,
        updateTrip.destinationid,
        updateTrip.coverimage,
        updateTrip.detail,
        updateTrip.price,
        updateTrip.duration,
        id,
       ]);
       conn.query(sql,(err,result)=>{
          if (err) throw err;
          res.status(201).json({ affected_row: result.affectedRows });
     });
      

});



