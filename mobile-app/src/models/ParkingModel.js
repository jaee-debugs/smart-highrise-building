export default class ParkingModel {
    constructor(data) {
        this.slotId = data.slotId;
        this.status = data.status; // 'occupied' or 'available'
    }
}
