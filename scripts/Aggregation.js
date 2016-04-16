//HW 5.4
db.zips.aggregate(
    [{
    	$project: {pop:1, fc: {$substr : ["$city",0,1]}}
    }, {
        $group: { _id: "$fc", spop: {$sum: '$pop'}}
    },{
    	$match: {_id: {$in: ['0','1','2','3','4','5','6','7','8','9']}}
    },{
    	$group: {_id: null, aspop: {$sum: '$spop'}}
    }]
)


//HW 5.3
db.grades.aggregate(
    [{
        $unwind: '$scores'
    }, {
        $match: { 'scores.type': { $in: ['homework', 'exam'] } }
    }, {
        $group: { _id: { sid: '$student_id', cid: '$class_id' }, avg: { $avg: '$scores.score' } }
    }, {
        $group: { _id: '$_id.cid', cavg: { $avg: '$avg' } }
    }, {
        $sort: { cavg: -1 }
    }]
)



// HW 5.2
db.zips.aggregate(
    [{
        $group: { _id: { state: '$state', city: '$city' }, avg: { $sum: '$pop' } }
    }, {
        $project: { avg: 1, state: '$_id.state', city: '$_id.city', _id: 0 }
    }, {
        $match: { state: { $in: ['CA', 'NY'] }, avg: { $gt: 25000 } }
    }, {
        $group: { _id: null, allAvg: { $avg: '$avg' } }
    }]
);

// HW 5.1
db.posts.aggregate([{ $unwind: '$comments' }, { $group: { _id: '$comments.author', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
