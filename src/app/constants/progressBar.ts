const images = {
  STEP_EDIT: '../../../../assets/icons/step-edit.svg',
  STEP_DONE: '../../../../assets/icons/step-edit-done.svg',
  STEP_2: '../../../../assets/icons/steps2.svg',
  STEP_3: '../../../../assets/icons/steps3.svg',
};

export const progressBar = {
  FLIGHTS: [
    { stepNo: 1, imgUrl: images.STEP_EDIT, text: 'Flights' },
    { stepNo: 2, imgUrl: images.STEP_2, text: 'Passengers' },
    { stepNo: 3, imgUrl: images.STEP_3, text: 'Review & Payment' },
  ],
  PASSENGERS: [
    { stepNo: 1, imgUrl: images.STEP_DONE, text: 'Flights' },
    { stepNo: 2, imgUrl: images.STEP_EDIT, text: 'Passengers' },
    { stepNo: 3, imgUrl: images.STEP_3, text: 'Review & Payment' },
  ],
  SUMMARY: [
    { stepNo: 1, imgUrl: images.STEP_DONE, text: 'Flights' },
    { stepNo: 2, imgUrl: images.STEP_DONE, text: 'Passengers' },
    { stepNo: 3, imgUrl: images.STEP_EDIT, text: 'Review & Payment' },
  ],
};
