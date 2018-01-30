$PicPath="./";
$FilterPath="./";
$ResultPath="D:\excludePicResult";
$Today=(Get-Date).ToString("yyyy-MM-dd hh:mm:ss");
$aPublicPic=@(); #ͼƬ����
$includePublicPic=@(); #ͼƬ���ڼ���
$excludePublicPic=@(); #��Ҫ�ų���ͼƬ

#����ͼƬ
Filter Where-PublicPic
{
   param([String[]]$extension = ('.png', '.jpg', '.gif'));  
   $_ | Where-Object {$extension -contains $_.Extension};
}

Dir $PicPath -Recurse |Where-PublicPic| Foreach-Object {
   $aPublicPic+=$_;
}




Write-Host "*****************************************";


Write-Host "Ҫ���˵�ͼƬ�����ǣ�";
Write-Host "*****************************************" -foregroundcolor Green;
Write-Host  $aPublicPic;
Write-Host "*****************************************" -foregroundcolor Green;

#return $FALSE;
ls $FilterPath -Recurse -Include *.js,*.wxml,*.wxs  | Select fullname  | ForEach-Object -Process{
   Write-Host $_.Fullname;
   
   $Filedata=(Get-Content $_.Fullname) -join "`r`n";
   $aPublicPic|Foreach{
     if(!($includePublicPic  -contains $_.Name) -And ($Filedata.IndexOf($_.Name) -gt 0)){
	   $includePublicPic+=$_.Name;
	 }
   }
}

$aPublicPic|Foreach{
 if(!($includePublicPic -Contains $_.Name)){
    $excludePublicPic+=$_;
  }
}
Write-Host "Ҫ�Ƴ���ͼƬ�����ǣ�";
Write-Host ($excludePublicPic -join " ") -foregroundcolor Red;
$enSure=Read-Host "ȷ��Ҫ�Ƴ������ͼƬ�� (y or n)"

if($enSure -eq  "y"){
      Write-Host "=======================yes======================";
	  if(![system.IO.Directory]::Exists($ResultPath)){
	  Write-Host "============��������ļ���========"+($ResultPath) -foregroundcolor Green;
	   #$NewPath=New-Item -Path $ResultPath  -Name result -Type directory;
	   $NewPath=New-Item  $ResultPath -Type directory;
	   #$ResultPath=$NewPath.name;
	  }
	  Write-Output ( "++++++++++++++++++++"+($Today)+"++++++++++++++++++++++++++") | out-file -Append -Encoding utf8 -Filepath ($ResultPath+"\result.txt");
	 $excludePublicPic|Foreach{   	   
		      Move-Item  $_.Fullname $ResultPath  #-ErrorAction "SilentlyContinue";
			  Write-Host "=============yes========"+($_) -foregroundcolor Green;
			  Write-Output ($_.Name) | out-file -Append -Encoding utf8 -Filepath ($ResultPath+"\result.txt");
	 }	 
	 
}else{
  write-Host  "no";
   
} 







