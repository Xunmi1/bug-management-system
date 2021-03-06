<template>
    <Collapse value="1" style="font-size: 14px">
        <Panel name="1">
            拥有的项目
            <div slot="content" class="card-layout">
                <Card class="card" @click.native="newProject('newProject')">
                    <p slot="title">新建项目</p>
                    <Icon type="plus-round" class="plus-round"></Icon>
                </Card>
                <Card class="card" v-for="project in ownerList" :key="project.info.id">
                    <p slot="title">{{project.info.title}}</p>
                    <div slot="extra">
                        <Poptip trigger="hover" placement="top-start" transfer>
                            <Icon type="ios-settings-strong fa-lg" color="#2d8cf0"></Icon>
                            <ButtonGroup slot="content" size="large">
                                <Button type="info" @click="changeProjectStatus(project, 2)">
                                    关闭项目
                                </Button>
                                <Button @click="changeProjectStatus(project, 3)">
                                    删除项目
                                </Button>
                            </ButtonGroup>
                        </Poptip>
                    </div>
                    <p>{{project.info.desc}}</p>
                    <div class="show-card-footer" @click="setDefaultIndex(project)">
                        <span>设为默认</span>
                    </div>
                </Card>
            </div>
        </Panel>
        <Panel name="2">
            参与的项目
            <div slot="content" class="card-layout">
                <Card class="card" v-for="project in partakeList" :key="project.info.id">
                    <p slot="title">{{project.info.title}}</p>
                    <p>{{project.info.desc}}</p>
                    <div class="show-card-footer" @click="setDefaultIndex(project)">
                        <span>设为默认</span>
                    </div>
                </Card>
            </div>
        </Panel>
        <Panel name="3">
            已关闭项目
            <div slot="content" class="card-layout">
                <Card class="card" v-for="project in closedList" :key="project.info.id">
                    <p slot="title">{{project.info.title}}</p>
                    <div slot="extra">
                        <Poptip trigger="hover" placement="top-start" transfer>
                            <Icon type="ios-settings-strong fa-lg" style="color: #2d8cf0"></Icon>
                            <ButtonGroup slot="content" size="large">
                                <Button type="info" @click="changeProjectStatus(project, 0)">重新打开</Button>
                                <Button @click="changeProjectStatus(project, 3)">删除项目</Button>
                            </ButtonGroup>
                        </Poptip>
                    </div>
                    <p>{{project.info.desc}}</p>
                </Card>
            </div>
        </Panel>
        <Panel name="4">
            删除的项目
            <div slot="content" class="card-layout">
                <Card class="card" v-for="project in deleteList" :key="project.info.id">
                    <p slot="title">{{project.info.title}}</p>
                    <div slot="extra">
                        <Poptip trigger="hover" placement="top-start" transfer>
                            <Icon type="ios-settings-strong fa-lg" style="color: #2d8cf0"></Icon>
                            <ButtonGroup slot="content" size="large">
                                <Button type="info" @click="changeProjectStatus(project, 2)">关闭项目</Button>
                                <Button @click="changeProjectStatus(project, 0)">重新打开</Button>
                            </ButtonGroup>
                        </Poptip>
                    </div>
                    <p>{{project.info.desc}}</p>
                </Card>
            </div>
        </Panel>
    </Collapse>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: "MyProject",
        data() {
            return {}
        },
        methods: {
            ...mapMutations({
                add: 'tagAdd',
                setIndex: 'setDefaultIndex'
            }),
            getPermission() {
                let userPermission = '';
                this.projectList[this.defaultIndex].people.forEach(item => {
                    if (item.userId == this.id) {
                        userPermission = item.permission;
                    }
                });
                this.$store.commit('setPermission', userPermission);
            },
            newProject(tag) {
                if (this.menuItem[tag]) {
                    this.add({
                        tag,
                        title: this.menuItem[tag].title,
                        name: this.menuItem[tag].name
                    });
                    this.$router.push({name: tag});
                }
            },
            // toStatus 目标项目状态
            changeProjectStatus(project, toStatus) {
                if (this.projectList[this.defaultIndex].info.id == project.info.id) {
                    this.setIndex();
                }
                this.$store.dispatch('changeProjectStatus', {project, toStatus}).then(res => {
                    if (res.status) {
                        this.$Message.success('修改成功！');
                    } else {
                        this.$Notice.error({
                            title: '修改失败！',
                            desc: '请检查网络状况，并重新点击确认'
                        });
                    }
                })
            },
            setDefaultIndex(project) {
                this.$store.dispatch('getIssue', project.info).then(res => {
                    if (!res.status) {
                        this.$Notice.error({
                            title: '问题数据获取失败！',
                            desc: '请检查网络状况，并重新设置默认项目'
                        });
                    }
                });
                this.setIndex(project);
                this.getPermission();
                this.$Message.success({
                    content: '<span style="font-size: 14px">项目设置成功！</span>',
                    duration: 2
                });
            }
        },
        computed: {
            ...mapState({
                id: state => state.user.userInfo.userId,
                menuItem: state => state.tagState.menuList,
                projectList: state => state.project.projectList,
                defaultIndex: state => state.project.defaultIndex,
            }),
            ownerList() {
                return this.projectList.filter(project => project.status === 0);
            },
            partakeList() {
                return this.projectList.filter(project => project.status === 1);
            },
            closedList() {
                return this.projectList.filter(project => project.status === 2);
            },
            deleteList() {
                return this.projectList.filter(project => project.status === 3);
            }
        },
        mounted() {
            this.$store.dispatch('getProject', {userId: this.id}).then(res => {
                if (!res.status) {
                    this.$Notice.error({
                        title: '项目信息获取失败！',
                        desc: '请检查网络状况，并重新进入系统'
                    });
                }
            });
        }
    }
</script>

<style scoped>
    .card-layout {
        overflow: hidden;
    }

    .card {
        width: 170px;
        height: 170px;
        margin: 12px;
        background-color: #f1f1f1;
        float: left;
    }

    .plus-round {
        font-size: 86px;
        width: 100%;
        text-align: center;
    }

    .show-card-footer {
        width: 170px;
        height: 0;
        background-color: #f1f1f1;
        position: absolute;
        left: -1px;
        bottom: 0;
        cursor: pointer;
        transition: all .5s;
    }

    .card:hover .show-card-footer {
        height: 40px;
        background-color: #f90;
    }

    .card:hover .show-card-footer > span {
        display: block;
        line-height: 40px;
    }

    .show-card-footer > span {
        display: none;
        font-size: 15px;
        color: #fff;
        text-align: center;
    }
</style>
