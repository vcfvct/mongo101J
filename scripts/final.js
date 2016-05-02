//Final 1
db.messages.find({ 'headers.From': 'andrew.fastow@enron.com', 'headers.To': 'jeff.skilling@enron.com' }).count()


// Final 2, use $addToSet to remove dups from the 'headers.To' list
// if the collection is to large, we could add '{allowDiskUse:true}' as the 2nd param of aggregate() function after the [].
db.messages.aggregate([{
    $project: { headers: '$headers' }
}, {
    $unwind: '$headers.To'
}, {
    $group: { _id: '$_id', from: { $first: '$headers.From' }, to: { $addToSet: '$headers.To' } }
}, {
    $unwind: '$to'
}, {
    $group: { _id: { from: '$from', to: '$to' }, sum: { $sum: 1 } }
}, {
    $sort: { sum: -1 }
}, {
    $limit: 10
}])


//Final 3
