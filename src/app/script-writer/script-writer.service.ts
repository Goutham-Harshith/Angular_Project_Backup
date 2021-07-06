import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from '../../Global';

@Injectable({
  providedIn: 'root'
})
export class ScriptWriterService {


  constructor(private HttpClient: HttpClient) { }

  getFolders() {
    return this.HttpClient.get(Global.BASE_PATH_VERSION_CTRL + "/codeRepoDetails")
  }

  gitFolderPreview(body)
  {
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/gitFolderPreview", body)
  }

  getFiles(body: any) {
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/FileVersions/", body)
  }
  postFileVersions(body: any) {
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/DisplayItem", body);
  }

  zeppelinConnectService(body: any) {
    return this.HttpClient.post(Global.BASE_PATH_TRANSFORM + "/zappelinConnect", body)
  }

  commitScript(body: any) {
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/GitCommit", body)
  }

  scriptFile(folderName: string, file :File ,dvc , comments :string) {
    var formData: FormData = new FormData();
    formData.append("folderName", folderName);
    formData.append("file", file);
    formData.append("dvc", dvc);
    formData.append("cmtMsg", comments);
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/AddFile", formData)
  }

  zepplin(body: any) {
    return this.HttpClient.post(Global.BASE_PATH_VERSION_CTRL + "/DisplayItem", body)
  }

  fetchNodeDetails(flowId, catId) {
    return this.HttpClient.get(Global.FETCH_NODE_DETAILS + "/" + flowId + "/" + catId);
  }

  deteleGitFiles(body)
  {
    return this.HttpClient.post(Global.DELETE_GIT_FILES, body)
  }

  editGitFile(body)
  {
    return this.HttpClient.post(Global.EDIT_GIT_FILES, body)
  }
}

