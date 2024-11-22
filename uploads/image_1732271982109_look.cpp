#include<bits/stdc++.h>
using namespace std;

int main(){
int n;
cout<<"Enter the no. of inputs to read"<<endl;
cin>>n;
int a[n];
cout<<"Enter the inputs to read"<<endl;
for(int i=0;i<n;i++){
    cin>>a[i];
}
int h,cost=0;
cout<<"Enter the starting position of cursor"<<endl;
cin>>h;
int head=h;
char t;
cout<<"Enter L to move towards Larger value else S"<<endl;
cin>>t;
for(int i=0;i<n;i++){
    for(int j=0;j<n-1;j++){
        if(a[j]>a[j+1]){
            int t1=a[j];
            a[j]=a[j+1];
            a[j+1]=t1;
        }
    }
}
int max1=a[n-1],min1=a[0];
int p=-1;
for(int i=0;i<n;i++){
    if(a[i]>h){
        p=i;
        break;
    }
}
if(t=='L'){
    for(int i=p;i<n;i++){
        cost+=a[i]-h;
        h=a[i];
        cout<<"total seek time at reaching "<<a[i]<<" is "<<cost<<endl;
    }
    cost*=2;
    h=head;
    for(int i=p-1;i>=0;i--){
        cost+=h-a[i];
        h=a[i];
        cout<<"total seek time at reaching "<<a[i]<<" is "<<cost<<endl;
    }
}
else{
    for(int i=p-1;i>=0;i--){
        cost+=h-a[i];
        h=a[i];
        cout<<"total seek time at reaching "<<a[i]<<" is "<<cost<<endl;
    }
    cost*=2;
    h=head;
    for(int i=p;i<n;i++){
        cost+=a[i]-h;
        h=a[i];
        cout<<"total seek time at reaching "<<a[i]<<" is "<<cost<<endl;
    }
}
cout<<"Total seek time in the LOOK disc scheduling algorithm is "<<cost<<endl;
return 1;
}
