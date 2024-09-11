// routes/userRoutes.js

const express = require('express');
const User = require('../models/userModel');

// Create a router
const router = express.Router();

// GET route to fetch all users
router.get('/users', async (req, res) => {
  try {
    console.log("Fetching users from MongoDB...");
    const users = await User.find({isDelete:false});
    console.log("Users found:", users);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/userSignUp', async (req, res) => {
  try {
    let toSave = req.body; 
    
    const newUser = new User(toSave);

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/updateUserDetails", async (req, res, next) => {
  try {

    let toUpdate = req.body;
    await User.updateOne(
      {
        _id: req.body.cardId,
      },
      {
        $set: toUpdate
      },
      {
        $upsert: true,
        $multi: true,
      }
    );

    res.status(200).send({
      status: "success",
      message: "user updated successFully!",
    });
  } catch (err) {
    next(err, req, res, next);
  }
});

router.post("/deleteUser", async (req, res, next) => {
  try {

    await User.updateOne(
      {
        _id: req.body.cardId,
      },
      {
        $set: {
          isDelete: true,
        },
      },
      {
        $upsert: true,
        $multi: true,
      }
    );

    res.send({
      status: "success",
      message: "updated successFully!",
    });
  } catch (err) {
    next(err, req, res, next);
  }
});

router.post("/userLogin", async (req, res, next) => {
  try {
    try {
      //console.log("Fetching users from MongoDB...");
      const users = await User.find({isDelete:false,
        _id:req.body.userId
      });
      //console.log("Users found:", users);

      res.status(500).send({
        status: "success",
        message: "Login Data!",
        data:users
      });
        } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } catch (err) {
    next(err, req, res, next);
  }
});



router.post("/changeIsShowApp", async (req, res, next) => {
  try {
    //let mycard = mongooseConnections.model("mycards", mycardSchema);
    let isShow = req.body.isShow;
    let toUpdate;
    if (isShow == false) {
      toUpdate = true;
    } else {
      toUpdate = false;
    }
    // await User.updateOne(
    //   {
    //     _id: req.body.cardId,
    //     "links.id": {
    //       $eq: new mongoose.Types.ObjectId(req.body.id),
    //     },
    //   },
    //   {
    //     $set: {
    //       "links.$.isShow": toUpdate,
    //     },
    //   },
    //   {
    //     $upsert: true,
    //     $multi: true,
    //   }
    // );

    res.send({
      status: "success",
      message: "updated successFully!",
    });
  } catch (err) {
    next(err, req, res, next);
  }
});


router.post("/getMyCardsLinkSetting", async (req, res, next) => {
  try {
    let cardSetting = mongooseConnections.model(
      "mycardsLinkSettings",
      mycardsLinkSettingSchema
    );
    let cardId = req.body.cardId;
    const agg = [
      {
        $match: {
          isActive: true,
          isDelete: false,
          isAdmin: false,
        },
      },
      {
        $addFields: {
          cardId: {
            $toObjectId: cardId,
          },
        },
      },
      {
        $lookup: {
          from: "mycards",
          let: {
            id: "$cardId",
            name: "$name",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],

                },
                isActive: true,
              },
            },
            {
              $unwind: {
                path: "$links",
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ["$links.name", "$$name"],
                },
              },
            },
            {
              $project: {
                linkId: "$links.id",
                groupName: "$links.groupName",
                name: "$links.name",
                value: "$links.value",
                desc: {
                  $cond: {
                    if: {
                      $and: [
                        { $ne: ["$links.desc", ""] },
                        { $ne: ["$links.desc", null] },
                        { $ifNull: ["$links.desc", false] },
                      ],
                    },
                    then: "$links.desc",
                    else: "Connect To Knowwu",
                  },
                },
                tagline: "$links.tagline",
                ispro: "$links.ispro",
                placeholder: "$links.placeholder",
                defaulturl: "$links.defaulturl",
                startwith: "$links.startwith",
                url: "$links.url",
                isShow: "$links.isShow",
              },
            },
          ],
          as: "LinkData",
        },
      },
      {
        $sort: {
          orderBy: 1,
        },
      },
      {
        $group: {
          _id: "$groupName",
          groupName: {
            $first: "$groupName",
          },
          groupId: {
            $first: "$_id",
          },
          childdata: {
            $push: {
              id: "$_id",
              name: "$name",
              displayName: "$displayName",
              icon: "$icon",
              orderBy: "$orderBy",
              ispro: "$ispro",
              placeholder: "$placeholder",
              defaulturl: "$defaulturl",
              startwith: "$startwith",
              desc: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$desc", ""] },
                      { $ne: ["$desc", null] },
                      { $ifNull: ["$desc", false] },
                    ],
                  },
                  then: "$desc",
                  else: "Connect To Knowwu",
                },
              },
              tagline: "$tagline",
              isShow: "$isShow",
              linkData: "$LinkData",
            },
          },
        },
      },
      {
        $sort: {
          groupId: 1,
        },
      },
    ];

    let result = await cardSetting.aggregate(agg);
    if (result != null) {
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/addNotificationGroup", async function (req, res, next) {
  try {
    let group = mongooseConnections.model("contactGroup", groupSchema);

    let srno = await group.find({}).sort({ srNo: -1 }).limit(1);
    let srNoo = srno[0]?.srNo || 1;

    const resData = await commonJs.fileUpload(req, res);
    var groupObj = JSON.parse(req.body.data);

    if (!Array.isArray(groupObj.mobiles)) {
      res.status(400).send({
        status: "error",
        message: "Mobile must be an array of numbers.",
      });
      return;
    }

    // Assign a default name ("x") to mobile numbers from notificationObj
    var mobilesFromObj = groupObj.mobiles.map((mobile) => ({
      mobile: mobile.mobile,
      name: mobile.name || "x",
    }));

    var csvMobiles = [];
    if (resData.filePath && resData.buffer) {
      try {
        const csvData = await csv().fromString(resData.buffer.toString());
        console.log("Parsed CSV Data:", csvData);

        // Extract mobileNumbers and names from CSV
        csvMobiles = csvData.map((row) => ({
          mobile: row.mobileNumbers.trim(),
          name: row.name || "x",
        }));
      } catch (error) {
        console.error("Error parsing CSV:", error.message);
        res.status(400).send({
          status: "error",
          message: "Error parsing CSV.",
        });
        return;
      }
    }

    // Combine phone numbers from JSON and CSV
    var allMobileNumbers = [...mobilesFromObj, ...csvMobiles];

    var groups = {
      mobiles: allMobileNumbers,
      groupName: groupObj.groupName,
      displayName: groupObj.displayName,
      userId: new mongoose.Types.ObjectId(groupObj.userId),
      srNo: srNoo + 1,
      message: groupObj.message,
    };

    // Save the group
    let newgroup = new group(groups);
    createUpdateDate(newgroup);
    await newgroup.save();

    res.status(200).send({
      status: "success",
      message: "Group Created!",
      data: groups,
    });
  } catch (err) {
    console.error("Error in file upload processing:", err.message);
    res.status(500).send({
      status: "error",
      message: "Internal server error.",
    });
  }
});

// Export the router
module.exports = router;
