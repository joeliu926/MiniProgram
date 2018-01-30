$PicPath="./";
$FilterPath="./";
$ResultPath="D:\excludePicResult";
$Today=(Get-Date).ToString("yyyy-MM-dd hh:mm:ss");
$aPublicPic=@(); #图片集合
$includePublicPic=@(); #图片存在集合
$excludePublicPic=@(); #需要排除的图片

#过滤图片
Filter Where-PublicPic
{
   param([String[]]$extension = ('.png', '.jpg', '.gif'));  
   $_ | Where-Object {$extension -contains $_.Extension};
}

Dir $PicPath -Recurse |Where-PublicPic| Foreach-Object {
   $aPublicPic+=$_;
}




Write-Host "*****************************************";


Write-Host "要过滤的图片集合是：";
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
Write-Host "要移除的图片集合是：";
Write-Host ($excludePublicPic -join " ") -foregroundcolor Red;
$enSure=Read-Host "确定要移除上面的图片吗 (y or n)"

if($enSure -eq  "y"){
      Write-Host "=======================yes======================";
	  if(![system.IO.Directory]::Exists($ResultPath)){
	  Write-Host "============创建结果文件夹========"+($ResultPath) -foregroundcolor Green;
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







