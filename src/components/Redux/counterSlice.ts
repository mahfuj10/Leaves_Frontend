import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
const drawerCondition = localStorage.getItem('openDrawer');

export interface DataState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
  messagedataLoading: boolean,
  loginUser: any,
  allUsers: any[],
  usersDataLoading: boolean,
  convertationUsers: any[],
  selectedUser: any,
  selectedGroupMembers: any[],
  allGroups: any[],
  groupsDataLoading: boolean,
  selectedGroup: any,
  messages: any[],
  messageDataLoading: boolean,
  groupChat: any[],
  createdGroup: any,
  joinedGroups: any[],
  searchText: string,
  deleteTextLoading: boolean,
  allMessageDeleteLoading: boolean,
  openDetailsSection: any,
  updateUserInfo: any
};

const initialState: DataState = {
  value: 0,
  status: 'idle',
  messagedataLoading: true,
  loginUser: {},
  allUsers: [],
  usersDataLoading: true,
  convertationUsers: [],
  selectedUser: {},
  selectedGroupMembers: [],
  allGroups: [],
  groupsDataLoading: true,
  selectedGroup: {},
  messages: [],
  messageDataLoading: true,
  groupChat: [],
  createdGroup: {},
  joinedGroups: [],
  searchText: "",
  updateUserInfo: '',
  deleteTextLoading: true,
  allMessageDeleteLoading: true,
  openDetailsSection: true
};


export const getAllMessages = createAsyncThunk(
  'messsages/data',
  async (roomID: number) => {
    const response = await axios.get(`https://enigmatic-garden-12643.herokuapp.com/chat/${roomID}`);
    return response.data;
  }
)

export const getAllUsers = createAsyncThunk(
  'allusers/data',
  async () => {
    const response = await axios.get(`https://enigmatic-garden-12643.herokuapp.com/users`);
    return response.data;
  }
)

export const gellAllGroups = createAsyncThunk(
  'allgroups/data',
  async () => {
    const response = await axios.get('https://enigmatic-garden-12643.herokuapp.com/group');
    return response.data;
  }
)

export const deleteChatMessage = createAsyncThunk(
  'deletemessage/data',
  async (id: any) => {
    const response: any = await axios.put(`https://enigmatic-garden-12643.herokuapp.com/chat/deletemessage/${id}`);
    return response.data;
  }
)

export const deleteAllRoomMessage = createAsyncThunk(
  'deleteallmessage/data',
  async (id: any) => {
    const response: any = await axios.delete(`https://enigmatic-garden-12643.herokuapp.com/chat/deleteallmessages/${id}`);
    return response.data;
  }
)

export const updateUserName = createAsyncThunk(
  'updateUserName/data',
  async (data: any) => {
    const response: any = await axios.put(`https://enigmatic-garden-12643.herokuapp.com/users/updatename/${data.uid}`, data);
    return response.data;
  }
)


export const updateUserNumber = createAsyncThunk(
  'updateUserNumber/data',
  async (data: any) => {
    const response: any = await axios.put(`https://enigmatic-garden-12643.herokuapp.com/users/updatennumber/${data.uid}`, data);
    return response.data;
  }
)


export const updateUserAddress = createAsyncThunk(
  'updateUserAddress/data',
  async (data: any) => {
    const response: any = await axios.put(`https://enigmatic-garden-12643.herokuapp.com/users/updatenaddress/${data.uid}`, data);
    return response.data;
  }
)


export const updateUserProfession = createAsyncThunk(
  'updateUserProfession/data',
  async (data: any) => {
    const response: any = await axios.put(`https://enigmatic-garden-12643.herokuapp.com/users/updatenprofession/${data.uid}`, data);
    return response.data;
  }
)



export const dataSlice = createSlice({
  name: 'dataSlice',
  initialState,

  reducers: {
    currentLoginUser: (state, action: PayloadAction<object>) => {
      state.loginUser = action.payload;
    },
    myConvertations: (state, action: PayloadAction<any>) => {
      state.convertationUsers = action.payload;
    },
    selectUser: (state, action: PayloadAction<any>) => {
      state.selectedUser = action.payload;
    },

    addGroupMembers: (state, action: PayloadAction<any>) => {
      state.selectedGroupMembers.push(action.payload);
    },
    removeFromSelectedPeople: (state, action: PayloadAction<any>) => {
      state.selectedGroupMembers = state.selectedGroupMembers.filter(member => member?.uid !== action.payload);
    },
    reseatGroupMembers: (state, action: PayloadAction<any>) => {
      state.selectedGroupMembers = [];
      state.selectedGroup = {};
    },
    selectGroup: (state, action: PayloadAction<Function>) => {
      state.selectedGroup = action.payload;
    },
    getGroupChat: (state, action: PayloadAction<any>) => {
      state.groupChat = action.payload;
    },
    saveCreatedGroup: (state, action: PayloadAction<any>) => {
      state.createdGroup = action.payload;
    },
    getJoinedGroups: (state, action: PayloadAction<any[]>) => {
      state.joinedGroups = action.payload;
    },
    saveSearchName: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setOpenDetailsSection: (state) => {
      state.openDetailsSection = false;
    },
    closeOpenDetailsSection: (state) => {
      state.openDetailsSection = true;
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.usersDataLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.usersDataLoading = false;
      })
      .addCase(gellAllGroups.pending, (state, action) => {
        state.groupsDataLoading = true;
      })
      .addCase(gellAllGroups.fulfilled, (state, { payload }) => {
        state.groupsDataLoading = false;
        state.allGroups = payload;
      })
      .addCase(getAllMessages.pending, (state, action) => {
        state.messageDataLoading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, { payload }) => {
        state.messageDataLoading = false;
        state.messages = payload;
      })
      .addCase(deleteChatMessage.pending, (state, action) => {
        state.deleteTextLoading = true;
      })
      .addCase(deleteChatMessage.fulfilled, (state, payload) => {
        state.deleteTextLoading = false;
      })
      .addCase(deleteAllRoomMessage.pending, (state, action) => {
        state.allMessageDeleteLoading = true;
      })
      .addCase(deleteAllRoomMessage.fulfilled, (state, payload) => {
        state.allMessageDeleteLoading = false;
      })
      .addCase(updateUserName.pending, (state, payload) => {
        state.updateUserInfo = true;
      })
      .addCase(updateUserName.fulfilled, (state, payload) => {
        state.updateUserInfo = false;
      })
      .addCase(updateUserNumber.pending, (state, payload) => {
        state.updateUserInfo = true;
      })
      .addCase(updateUserNumber.fulfilled, (state, payload) => {
        state.updateUserInfo = false;
      })
      .addCase(updateUserAddress.pending, (state, payload) => {
        state.updateUserInfo = true;
      })
      .addCase(updateUserAddress.fulfilled, (state, payload) => {
        state.updateUserInfo = false;
      })
      .addCase(updateUserProfession.pending, (state, payload) => {
        state.updateUserInfo = true;
      })
      .addCase(updateUserProfession.fulfilled, (state, payload) => {
        state.updateUserInfo = false;
      })
  },
});

export const { currentLoginUser, myConvertations, selectUser, addGroupMembers, removeFromSelectedPeople, selectGroup, getGroupChat, saveCreatedGroup, reseatGroupMembers, getJoinedGroups, saveSearchName, setOpenDetailsSection, closeOpenDetailsSection } = dataSlice.actions;

export default dataSlice.reducer;
